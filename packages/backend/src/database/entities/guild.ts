import { Entity, Column, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role';
import { BaseEntity } from './base-entity';

@Entity()
export class Guild extends BaseEntity<Guild> {
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

  /**
   * If the blink is hidden from the marketplace
   */
  @Column({ type: 'boolean', default: false })
  hidden: boolean;

  @OneToMany(() => Role, (role) => role.guild, { onDelete: 'CASCADE' })
  roles: Role[];

  /**
   * If true, limited time roles will be enabled
   */
  @Column({ type: 'boolean', default: false })
  limitedTimeRoles: boolean;

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
