import { Entity, Column, PrimaryColumn } from 'typeorm';
import { BaseEntity } from './base-entity';

/**
 * Used to store discord access tokens when assigning roles to a user
 * Access token has a longer lifetime, while grant code has just 1 minute
 * For safety store access token (encrypted), in case the user purchase flow takes more than 1 minute
 */
@Entity()
export class AccessToken extends BaseEntity<AccessToken> {
  /**
   * Discord role ID
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  code: string;

  /**
   * Discord role ID
   */
  @Column({ type: 'varchar' })
  discordUserId: string;

  /**
   * Encrypted access token stored in DB
   */
  @Column({ type: 'varchar' })
  token: string;

  /**
   * Date and time when the token expires
   */
  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
