export interface BaseEntity {
  id: number;
}

export type CreateEntityParams<T> = Omit<T, 'id'>;

export interface IBaseRepository<T extends BaseEntity> {
  create(entity: CreateEntityParams<T>): Promise<T>;
}
