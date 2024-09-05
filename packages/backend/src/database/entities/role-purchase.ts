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
}
