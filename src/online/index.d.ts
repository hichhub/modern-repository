import IRepository from "../IRepository";
import { IEventEmitter } from "@hichestan/ui-misc/src/EventHandler";
import { IPersistableCircularBuffer } from "circular_buffer/src/interfaces/ICircularBuffer";
export default class OfflineRepository<T, PK> implements IRepository<T, PK> {
    private eventHandler;
    private buffer;
    private modelToPkFn;
    private modelClass;
    constructor(modelClass: T, eventHandler: IEventEmitter, buffer: IPersistableCircularBuffer<T>, modelToPkFn: (model: T) => PK);
    private getPk;
    add(model: T): Promise<T>;
    delete(model: T | PK): Promise<boolean | T>;
    edit(model: T): Promise<T>;
    get(primaryKey: PK): Promise<T>;
    search(mongoQuery: Object, skip?: number, limit?: number): Promise<T[]>;
}
