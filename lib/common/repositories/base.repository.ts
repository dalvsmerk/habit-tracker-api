export interface BaseEntity {
  id: number;
}

export interface IBaseRepository<T extends BaseEntity> {
  create(entity: Omit<T, 'id'>): Promise<T>;
}
