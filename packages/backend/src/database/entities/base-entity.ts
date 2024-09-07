import { CreateDateColumn } from 'typeorm';

export class BaseEntity<T> {
  constructor(data: Partial<T>) {
    Object.assign(this, data);
  }

  @CreateDateColumn()
  createTime: Date;
}
