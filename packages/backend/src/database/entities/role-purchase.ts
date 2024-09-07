import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Guild } from './guild';
import { Role } from './role';
import { BaseEntity } from './base-entity';

@Entity()
export class RolePurchase extends BaseEntity<RolePurchase> {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Discord ID of the user purchaser
   */
  @Column({ type: 'varchar' })
  discordUserId: string;

  @ManyToOne(() => Guild, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'guildId' })
  guild: Guild;

  @ManyToOne(() => Role, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  /**
   * If role is limited time only, this is when it expires
   */
  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  setExpiresAt() {
    const { limitedTimeUnit, limitedTimeQuantity, limitedTimeRoles } = this.guild;
    if (!limitedTimeRoles) return;

    const now = new Date();

    switch (limitedTimeUnit) {
      case 'Hours':
        now.setHours(now.getHours() + +limitedTimeQuantity);
        break;
      case 'Days':
        now.setDate(now.getDate() + +limitedTimeQuantity);
        break;
      case 'Weeks':
        now.setDate(now.getDate() + +limitedTimeQuantity * 7);
        break;
      case 'Months':
        now.setMonth(now.getMonth() + +limitedTimeQuantity);
        break;
      default:
        throw new Error(`Unsupported time unit: ${limitedTimeUnit}`);
    }

    this.expiresAt = now;
    return this;
  }
}
