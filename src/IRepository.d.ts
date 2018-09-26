interface IRepository<T, PK> {
    get(primaryKey: PK): Promise<T>;
    add(model: T): Promise<T>;
    edit(model: T): Promise<T>;
    delete(model: T | PK): Promise<T | boolean>;
    search(mongoQuery: Object, skip: number, limit: number): Promise<T[]>;
}
export default IRepository;
