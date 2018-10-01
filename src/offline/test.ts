import EventHandler from "@hichestan/ui-misc/src/EventHandler";
import MemkvStore from "circular_buffer/src/modules/memkvstore";
import PersistableCircularBuffer from "circular_buffer/src/modules/persistable_circularbuffer";
import {EVENTS_CONST} from "../consts";
import OfflineRepository from "./index";

class Model {
	public p1: number;
	public p2: string;
}

class Model2 {
	public p1: number;
	public p2: string;
	public p3: Model;
}

// @ts-ignore
const Main = async () => {
	const store = new MemkvStore();
	const buffer = new PersistableCircularBuffer<Model>(1000, store, "test");
	const eventHandler = EventHandler.getInstance("test");

	const offRepo = new OfflineRepository(eventHandler, buffer, (x) => x.p1);

	eventHandler.on(EVENTS_CONST.BEFORE_ADD, (x) => {
		console.log(EVENTS_CONST.BEFORE_ADD, x);
	});
	eventHandler.on(EVENTS_CONST.AFTER_ADD, (x) => {
		console.log(EVENTS_CONST.AFTER_ADD, x);
	});

	eventHandler.on(EVENTS_CONST.BEFORE_SEARCH, (x) => {
		console.log(EVENTS_CONST.BEFORE_SEARCH, x);
	});
	eventHandler.on(EVENTS_CONST.AFTER_SEARCH, (x) => {
		console.log(EVENTS_CONST.AFTER_SEARCH, x);
	});

	for (let i = 0; i < 3; i++) {
		const newModel = new Model();
		newModel.p1 = i;
		newModel.p2 = `model 1 ${i}`;

		const newModel2 = new Model2();
		newModel2.p1 = i;
		newModel2.p2 = `model 2 ${i}`;
		newModel2.p3 = newModel;

		offRepo.add(newModel2);

	}

	const searchResult = await offRepo.search({$or: [{p1: 1}, {"p3.p1": 2}]});
	console.log(`searchResult: `, searchResult);
};

Main();
