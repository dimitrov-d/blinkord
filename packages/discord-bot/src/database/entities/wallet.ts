import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Wallet {
  constructor(address: string, discordUserId: string, privateKey: string) {
    this.address = address;
    this.discordUserId = discordUserId;
    this.privateKey = privateKey;
  }
  /**
   * Public address of the wallet
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  address: string;

  /**
   * Discord ID of user who owns the wallet
   */
  @Column({ type: 'varchar' })
  discordUserId: string;

  /**
   * Encrypted private key for this wallet
   */
  @Column({ type: 'varchar' })
  privateKey: string;

  @CreateDateColumn()
  createTime: Date;
}
