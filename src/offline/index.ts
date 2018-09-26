import sift from "sift";
import IRepository from "../IRepository";
import {IEventEmitter} from "@hichestan/ui-misc/src/EventHandler";
import {IPersistableCircularBuffer} from "circular_buffer/src/interfaces/ICircularBuffer";

export const EVENTS_CONST = {
	BEFORE_EDIT: "BEFORE_EDIT",
	AFTER_EDIT: "AFTER_EDIT",
	BEFORE_ADD: "BEFORE_ADD",
	AFTER_ADD: "AFTER_ADD",
	BEFORE_GET: "BEFORE_GET",
	AFTER_GET: "AFTER_GET",
	BEFORE_DELETE: "BEFORE_DELETE",
	AFTER_DELETE: "AFTER_DELETE",
	BEFORE_SEARCH: "BEFORE_SEARCH",
	AFTER_SEARCH: "AFTER_SEARCH",
};

export default class OfflineRepository<T, PK> implements IRepository<T, PK> {

	private eventHandler: IEventEmitter;
	private buffer: IPersistableCircularBuffer<T>;
	private modelToPkFn: (model: T) => PK;
	private modelClass: T;

	constructor(modelClass: T, eventHandler: IEventEmitter, buffer: IPersistableCircularBuffer<T>, modelToPkFn: (model: T) => PK) {
		this.modelClass = modelClass;
		this.eventHandler = eventHandler;
		this.buffer = buffer;
		this.modelToPkFn = modelToPkFn;
	}

	private getPk(primaryKey: PK): string {
		const key = typeof primaryKey === "string" ? primaryKey : JSON.stringify(primaryKey);
		return key;
	}

	async add(model: T): Promise<T> {
		const eventPayload = {
			repo: this,
			model
		};

		this.eventHandler.emit(EVENTS_CONST.BEFORE_ADD, eventPayload);
		//fixme: check promise from circular_buffer

		const pk = this.modelToPkFn(model);
		await this.buffer.set(this.getPk(pk), model);
		this.eventHandler.emit(EVENTS_CONST.AFTER_ADD, eventPayload);
		return model;
	}

	async delete(model: T | PK): Promise<boolean | T> {
		const eventPayload = {
			repo: this,
			model
		};

		this.eventHandler.emit(EVENTS_CONST.BEFORE_DELETE, eventPayload);
		//fixme: check promise from circular_buffer
		let pk: PK;
		if (model instanceof this.modelClass) {
			pk = this.modelToPkFn(model as T)
		} else {
			pk = model as PK;
		}
		const pkStr = this.getPk(pk);
		await this.buffer.del(pkStr);
		this.eventHandler.emit(EVENTS_CONST.AFTER_DELETE, eventPayload);
		return model;
	}

	async edit(model: T): Promise<T> {
		const eventPayload = {
			repo: this,
			model
		};

		this.eventHandler.emit(EVENTS_CONST.BEFORE_EDIT, eventPayload);
		//fixme: check promise from circular_buffer

		const pk = this.modelToPkFn(model);
		await this.buffer.set(this.getPk(pk), model);
		this.eventHandler.emit(EVENTS_CONST.AFTER_EDIT, eventPayload);
		return model;
	}

	async get(primaryKey: PK): Promise<T> {
		const eventPayload = {
			repo: this,
			primaryKey,
			model: null,
		};

		this.eventHandler.emit(EVENTS_CONST.BEFORE_GET, eventPayload);

		const model = await this.buffer.get(this.getPk(primaryKey));

		eventPayload.model = model;
		this.eventHandler.emit(EVENTS_CONST.AFTER_GET, eventPayload);

		return model
	}

	async search(mongoQuery: Object, skip: number = 0, limit: number = 10): Promise<T[]> {
		const eventPayload = {
			repo: this,
			mongoQuery,
			skip,
			limit,
			models: null,
		};

		this.eventHandler.emit(EVENTS_CONST.BEFORE_SEARCH, eventPayload);
		const dataArray = await this.buffer.toArray((v) => !!v);
		const result = sift(mongoQuery, dataArray)
			.splice(skip, limit);
		// fixme:: handle order in query

		eventPayload.models = result;
		this.eventHandler.emit(EVENTS_CONST.AFTER_SEARCH, eventPayload);

		return result;
	}

}