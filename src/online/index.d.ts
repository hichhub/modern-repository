import { IEventEmitter } from "@hichestan/ui-misc/src/EventHandler";
import IRestProvider from "@hichestan/ui-misc/src/RestProvider/IRestProvider";
import IRepository from "../IRepository";
export interface IRepoActionParam<T> {
    id?: string;
    skip?: number;
    limit?: number;
    model?: T;
}
export interface IEventPayload<T, PK, R> {
    model?: T;
    models?: T[];
    repo?: R;
    url?: string;
    primaryKey?: PK;
    skip?: number;
    limit?: number;
    mongoQuery?: object;
}
export default class OnlineRepository<T, PK> implements IRepository<T, PK> {
    private eventHandler;
    private restProvider;
    private modelToPkFn;
    private baseUrl;
    private urlBuilder;
    protected defaultUrlBuilder(repoAction: string, baseUrl: string, params?: IRepoActionParam<T>): string;
    constructor(eventHandler: IEventEmitter, restProvider: IRestProvider<T>, modelToPkFn: (model: T) => PK, baseUrl: string, urlBuilder?: (repoAction: string, baseUrl: string, params?: IRepoActionParam<T>) => string);
    add(model: T): Promise<T>;
    delete(pk: PK): Promise<boolean>;
    edit(model: T): Promise<T>;
    get(primaryKey: PK): Promise<T>;
    search(mongoQuery: object, skip?: number, limit?: number): Promise<T[]>;
    private getPk;
}
