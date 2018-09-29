import IRepository from "../IRepository";
export interface IFaseResult<T> {
    offlineResult: T;
    onlinePromise: Promise<T>;
}
export default class Repository<T, PK> implements IRepository<T, PK> {
    private onlineRepo;
    private offlineRepo;
    private isOnline;
    constructor(onlineRepository: IRepository<T, PK>, offlineRepository: IRepository<T, PK>, isOnline: () => boolean);
    add(model: T): Promise<T>;
    delete(model: T | PK): Promise<boolean | T>;
    edit(model: T): Promise<T>;
    get(primaryKey: PK): Promise<T>;
    getFast(primaryKey: PK): Promise<IFaseResult<T>>;
    search(mongoQuery: object, skip: number, limit: number): Promise<T[]>;
    searchFast(mongoQuery: object, skip: number, limit: number): Promise<IFaseResult<T[]>>;
}
