import IRepository from "../IRepository";
import { IEventEmitter } from "@hichestan/ui-misc/src/EventHandler";
import { IPersistableCircularBuffer } from "circular_buffer/src/interfaces/ICircularBuffer";
export declare const EVENTS_CONST: {
    BEFORE_EDIT: string;
    AFTER_EDIT: string;
    BEFORE_ADD: string;
    AFTER_ADD: string;
    BEFORE_GET: string;
    AFTER_GET: string;
    BEFORE_DELETE: string;
    AFTER_DELETE: string;
    BEFORE_SEARCH: string;
    AFTER_SEARCH: string;
};
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
