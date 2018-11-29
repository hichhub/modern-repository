import {IEventEmitter} from "@hichestan/ui-misc/src/EventHandler";
import IRestProvider from "@hichestan/ui-misc/src/RestProvider/IRestProvider";
import {EVENTS_CONST, REPO_ACTIONS} from "../consts";
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

	private eventHandler: IEventEmitter;
	private restProvider: IRestProvider<T>;
	private modelToPkFn: (model: T) => PK;
	private baseUrl: string;
	private urlBuilder: (repoAction: string, baseUrl: string, params?: IRepoActionParam<T>) => string;

	protected defaultUrlBuilder(repoAction: string, baseUrl: string, params?: IRepoActionParam<T>): string {
		switch (repoAction) {
			case REPO_ACTIONS.ADD:
				return baseUrl;
			case REPO_ACTIONS.EDIT:
                return `${baseUrl}/${params.id && params.id ? params.id : ''}`;
			case REPO_ACTIONS.GET:
                return baseUrl;
			case REPO_ACTIONS.DELETE:
				return `${baseUrl}/${params.id}`;
			case REPO_ACTIONS.SEARCH:
				return `${baseUrl}/search/${params.skip}/${params.limit}`;
		}

		return baseUrl;
	}

	constructor(eventHandler: IEventEmitter, restProvider: IRestProvider<T>,
				modelToPkFn: (model: T) => PK, baseUrl: string,
				urlBuilder?: (repoAction: string, baseUrl: string, params?: IRepoActionParam<T>) => string) {
		this.eventHandler = eventHandler;
		this.restProvider = restProvider;
		this.modelToPkFn = modelToPkFn;
		this.baseUrl = baseUrl;
		this.urlBuilder = urlBuilder || this.defaultUrlBuilder;
	}

	public async add(model: T): Promise<T> {
		const url = this.urlBuilder(REPO_ACTIONS.ADD, this.baseUrl);

		const eventPayload: IEventPayload<T, PK, OnlineRepository<T, PK>> = {
			model,
			repo: this,
			url,
		};

		this.eventHandler.emit(EVENTS_CONST.BEFORE_ADD, eventPayload);

		const resultModel = await this.restProvider.create(url, model);
		eventPayload.model = resultModel;

		this.eventHandler.emit(EVENTS_CONST.AFTER_ADD, eventPayload);

		return resultModel;
	}

	public async delete(pk: PK): Promise<boolean> {
		const pkStr = this.getPk(pk);

		const url = this.urlBuilder(REPO_ACTIONS.DELETE, this.baseUrl, {id: pkStr});

		const eventPayload: IEventPayload<T, PK, OnlineRepository<T, PK>> = {
			primaryKey: pk,
			repo: this,
			url,
		};

		this.eventHandler.emit(EVENTS_CONST.BEFORE_DELETE, eventPayload);

		await this.restProvider.delete(url);

		this.eventHandler.emit(EVENTS_CONST.AFTER_DELETE, eventPayload);

		return true;
	}

	public async edit(model: T): Promise<T> {
		const pk = this.modelToPkFn(model);
		const pkStr = this.getPk(pk);
		const url = this.urlBuilder(REPO_ACTIONS.EDIT, this.baseUrl, {id: pkStr});

		const eventPayload: IEventPayload<T, PK, OnlineRepository<T, PK>> = {
			model,
			repo: this,
			url,
		};

		this.eventHandler.emit(EVENTS_CONST.BEFORE_EDIT, eventPayload);

		const resultModel = await this.restProvider.edit(url, model);

		eventPayload.model = resultModel;
		this.eventHandler.emit(EVENTS_CONST.AFTER_EDIT, eventPayload);

		return resultModel;
	}

	public async get(primaryKey: PK): Promise<T> {

		const pkStr = this.getPk(primaryKey);
		const url = this.urlBuilder(REPO_ACTIONS.GET, this.baseUrl, {id: pkStr});

		const eventPayload: IEventPayload<T, PK, OnlineRepository<T, PK>> = {
			model: null,
			primaryKey,
			repo: this,
			url,
		};

		this.eventHandler.emit(EVENTS_CONST.BEFORE_GET, eventPayload);

		const resultModel = await this.restProvider.get(url);

		eventPayload.model = resultModel;
		this.eventHandler.emit(EVENTS_CONST.AFTER_GET, eventPayload);

		return resultModel;
	}

	public async search(mongoQuery: object, skip: number = 0, limit: number = 10): Promise<T[]> {

		const url = this.urlBuilder(REPO_ACTIONS.SEARCH, this.baseUrl, {skip, limit});

		const eventPayload: IEventPayload<T, PK, OnlineRepository<T, PK>> = {
			limit,
			models: null,
			mongoQuery,
			repo: this,
			skip,
			url,
		};

		this.eventHandler.emit(EVENTS_CONST.BEFORE_SEARCH, eventPayload);
		const dataArray = await this.restProvider.search(url, mongoQuery);

		eventPayload.models = dataArray;
		this.eventHandler.emit(EVENTS_CONST.AFTER_SEARCH, eventPayload);

		return dataArray;
	}

	private getPk(primaryKey: PK): string {
		const key = typeof primaryKey === "string" ? primaryKey : JSON.stringify(primaryKey);
		return key;
	}

}
