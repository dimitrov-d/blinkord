import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

export enum WalletType {
  GENERATED = 1,
  IMPORTED = 2,
  EMBEDDED = 3,
}

@Entity()
export class Wallet {
  constructor(address: string, discordUserId: string) {
    this.address = address;
    this.discordUserId = discordUserId;
    this.type = WalletType.EMBEDDED;
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
  @Column({ type: 'varchar', nullable: true })
  privateKey: string;

  /**
   * Type of the wallet based on how it was created
   */
  @Column({ type: 'enum', enum: WalletType })
  type: WalletType;

  @CreateDateColumn()
  createTime: Date;
}
