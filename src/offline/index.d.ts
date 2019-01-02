import { IEventEmitter } from "@hichestan/ui-misc/src/EventHandler";
import { IPersistableCircularBuffer } from "circular_buffer/src/interfaces/ICircularBuffer";
import IRepository from "../IRepository";
export default class OfflineRepository<T, PK> implements IRepository<T, PK> {
    protected eventHandler: IEventEmitter;
    protected buffer: IPersistableCircularBuffer<T>;
    private modelToPkFn;
    constructor(eventHandler: IEventEmitter, buffer: IPersistableCircularBuffer<T>, modelToPkFn: (model: T) => PK);
    add(model: T): Promise<T>;
    delete(pk: PK): Promise<boolean>;
    edit(model: T): Promise<T>;
    get(primaryKey: PK): Promise<T>;
    search(mongoQuery: object, skip?: number, limit?: number): Promise<T[]>;
    private getPk;
}
