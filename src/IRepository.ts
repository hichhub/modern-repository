interface IRepository<T, PK> {

	get (primaryKey: PK): Promise<T>;

	add (model: T): Promise<T>;

	edit (model: T): Promise<T>;

	delete (primaryKey: PK): Promise<boolean>;

	search (mongoQuery: object, skip: number, limit: number): Promise<T[]>;

}

export default IRepository;
