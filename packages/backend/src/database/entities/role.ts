import { Entity, Column, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Guild } from './guild';
import { BaseEntity } from './base-entity';

@Entity()
export class Role extends BaseEntity<Role> {
  /**
   * Discord role ID
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  /**
   * Amount of Solana this role costs
   */
  @Column('decimal', { precision: 9, scale: 5 })
  amount: number;

  @ManyToOne(() => Guild, (guild) => guild.roles, { nullable: false, onDelete: 'CASCADE' })
  guild: Guild;
  
  /**
   * Quantity of unit until role purchases expire
   * @example 2
   */
  @Column({ type: 'int', nullable: true })
  limitedTimeQuantity: number;

  /**
   * Type of time unit matched with quantity to get expiration time
   * @example 'Days'
   */
  @Column({ type: 'varchar', nullable: true })
  limitedTimeUnit: 'Hours' | 'Days' | 'Weeks' | 'Months';

  @UpdateDateColumn()
  updateTime: Date;
}
