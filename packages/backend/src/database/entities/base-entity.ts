export class BaseEntity<T> {
  constructor(data: Partial<T>) {
    Object.assign(this, data);
  }
}
