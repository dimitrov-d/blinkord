import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity<T> {
  constructor(data: Partial<T>) {
    Object.assign(this, data);
  }

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
