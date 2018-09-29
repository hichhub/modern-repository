import IRepository from "../IRepository";

export interface IFaseResult<T> {
	offlineResult: T;
	onlinePromise: Promise<T>;
}

export default class Repository<T, PK> implements IRepository<T, PK> {

	private onlineRepo: IRepository<T, PK>;
	private offlineRepo: IRepository<T, PK>;
	private isOnline: () => boolean;

	constructor(onlineRepository: IRepository<T, PK>, offlineRepository: IRepository<T, PK>, isOnline: () => boolean) {
		this.onlineRepo = onlineRepository;
		this.offlineRepo = offlineRepository;
		this.isOnline = isOnline;

	}

	public async add(model: T): Promise<T> {
		if (this.isOnline()) {
			return this.onlineRepo.add(model);
		} else {
			return this.offlineRepo.add(model);
		}
	}

	public async delete(model: T | PK): Promise<boolean | T> {
		if (this.isOnline()) {
			return this.onlineRepo.delete(model);
		} else {
			// return this.offlineRepo.delete(model);
			throw new Error("Delete method is not callable in offline mode");
		}
	}

	public async edit(model: T): Promise<T> {
		if (this.isOnline()) {
			return this.onlineRepo.edit(model);
		} else {
			// return this.offlineRepo.edit(model);
			throw new Error("Delete method is not callable in offline mode");
		}
	}

	public async get(primaryKey: PK): Promise<T> {
		if (this.isOnline()) {
			return this.onlineRepo.get(primaryKey);
		} else {
			return this.offlineRepo.get(primaryKey);
		}
	}

	public async getFast(primaryKey: PK): Promise<IFaseResult<T>> {
		const offResult = await this.offlineRepo.get(primaryKey);
		const onPromise = this.onlineRepo.get(primaryKey);

		return {
			offlineResult: offResult,
			onlinePromise: onPromise,
		};
	}

	public async search(mongoQuery: object, skip: number, limit: number): Promise<T[]> {
		if (this.isOnline()) {
			return this.onlineRepo.search(mongoQuery, skip, limit);
		} else {
			return this.offlineRepo.search(mongoQuery, skip, limit);
		}
	}

	public async searchFast(mongoQuery: object, skip: number, limit: number): Promise<IFaseResult<T[]>> {
		const offResult = await this.offlineRepo.search(mongoQuery, skip, limit);
		const onPromise = this.onlineRepo.search(mongoQuery, skip, limit);

		return {
			offlineResult: offResult,
			onlinePromise: onPromise,
		};
	}
}
