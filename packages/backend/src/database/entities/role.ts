import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Guild } from './guild';

@Entity()
export class Role {
  constructor(role: Partial<Role>) {
    Object.assign(this, role);
  }

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
}
