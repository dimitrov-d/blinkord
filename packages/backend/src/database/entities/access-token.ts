import { Entity, Column, PrimaryColumn } from 'typeorm';

/**
 * Used to store discord access tokens when assigning roles to a user
 * Access token has a longer lifetime, while grant code has just 1 minute
 * For safety store access token (encrypted), in case the user purchase flow takes more than 1 minute
 */
@Entity()
export class AccessToken {
  constructor(token: Partial<AccessToken>) {
    Object.assign(this, token);
  }

  /**
   * Discord role ID
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  code: string;

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
