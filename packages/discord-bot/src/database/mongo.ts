import { MongoClient, Db, Collection } from 'mongodb';
import { Action } from '../types/types';
import axios from 'axios';
import { ActionsURLMapper } from '../services/action-mapper';

export class MongoDB {
  private client: MongoClient;
  private db: Db;
  private collection: Collection;

  constructor() {
    this.client = new MongoClient(process.env.MONGO_URI);
  }

  async connect() {
    try {
      await this.client.connect();
      this.db = this.client.db('cache');
      this.collection = this.db.collection('action-cache');

      // Create an index to automatically delete documents after 1 day
      await this.collection.createIndex({ timestamp: 1 }, { expireAfterSeconds: 86_400 });
      console.info('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
    }
  }

  async getActionCache(origin: string): Promise<Action> {
    const doc = await this.collection.findOne({ origin });
    return doc?.data;
  }

  async setActionCache(origin: string, data: Action): Promise<void> {
    await this.collection.updateOne({ origin }, { $set: { data, timestamp: new Date() } }, { upsert: true });
  }

  async closeConnection() {
    await this.client.close();
  }

  async getOrSetActionData(url: string): Promise<Action | null> {
    try {
      // Check if the action URL is already in MongoDB
      const actionResponse = await this.getActionCache(url);

      if (actionResponse) return actionResponse;

      const { data: actionsJson } = await axios.get(`${new URL(url).origin}/actions.json`);
      let actionApiUrl = new ActionsURLMapper(actionsJson).mapUrl(new URL(url));
      if (!actionApiUrl) return;

      // Exception for Blinkord
      if (actionApiUrl.includes('blinkord.com')) actionApiUrl += '?showRoles=true';

      const { data } = await axios.get(actionApiUrl);
      data?.links?.actions?.forEach((action: any) => {
        action.href = action.href.startsWith('http') ? action.href : `${new URL(actionApiUrl).origin}${action.href}`;
      });
      // Store the entire action data in MongoDB
      await this.setActionCache(url, data);
      return data;
    } catch (err) {
      // If the action API URL is not found, try to get the data from the direct URL
      if (err.response?.status === 404) {
        const { data } = await axios.get(url).catch(() => ({ data: null }));
        if (data) {
          data?.links?.actions?.forEach((action: any) => {
            action.href = action.href.startsWith('http') ? action.href : `${new URL(url).origin}${action.href}`;
          });
          await this.setActionCache(url, data);
          return data;
        }
      }
      console.error(`Error getting or setting action data: ${err}`);
    }
  }
}
