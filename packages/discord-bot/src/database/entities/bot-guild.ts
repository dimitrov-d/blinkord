import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('bot_guild')
export class BotGuild {
  constructor(botGuild: Partial<BotGuild>) {
    Object.assign(this, botGuild);
  }

  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  icon: string;

  @Column({ type: 'text', nullable: true })
  whitelistedDomains: string;

  @CreateDateColumn()
  createTime: Date;
}
