import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Role } from './role';

@Entity()
export class Guild {
  constructor(guild: Partial<Guild>) {
    Object.assign(this, guild);
  }

  /**
   * Discord guild ID
   */
  @PrimaryColumn({ type: 'varchar', unique: true })
  id: string;

  /**
   * The wallet address that payments are sent to
   */
  @Column({ type: 'varchar' })
  address: string;

  /**
   * Name of the guild, this will be displayed on the blink
   */
  @Column({ type: 'varchar' })
  name: string;

  /**
   * URL of the icon that will be displayed on the blink
   */
  @Column({ type: 'varchar' })
  iconUrl: string;

  /**
   * Description that will be shown on the blink
   */
  @Column({ type: 'text' })
  description: string;

  /**
   * Details of the server, with custom description of the whole server and the roles
   */
  @Column({ type: 'text', nullable: true })
  details: string;

  /**
   * If the guild owner wants to receive payment in SEND tokens
   */
  @Column({ type: 'boolean', default: false })
  useSend: boolean;

  /**
   * TLD of user domains, used to give discounts for buying roles
   */
  @Column({ type: 'text', nullable: true })
  domainsTld: string;

  @OneToMany(() => Role, (role) => role.guild, { onDelete: 'CASCADE' })
  roles: Role[];
}
