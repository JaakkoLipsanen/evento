import * as enzyme from 'enzyme';
import sinon from 'sinon';
import Cookie from 'js-cookie';
import fetchMock from 'fetch-mock';
import mockFactory from './mock-factory';

const cookies = {
	set(cookies) {
		for(let param of Object.keys(cookies)) {
			Cookie.set(param, JSON.stringify(cookies[param]));
		}
	},
	
	reset() {
		Object.keys(Cookie.get()).forEach(function(cookie) {
			Cookie.remove(cookie);
		});
	}
};

const DefaultErrorMessage = "Something went wrong";
const mocks = {		
	// deconstructs all values (event, events, user, users etc) to this object.
	...mockFactory.createAll(),
		
	api: {
		DefaultErrorMessage: DefaultErrorMessage,
		responses: {
			get DefaultError() {
				return () => { return { success: false, error: { type: "unknown", message: DefaultErrorMessage } } };
			},
			
			create(payload) {
				return { success: true, payload: payload };
			},
			
			createError(error) {
				return { success: false, error: { type: error.type || "unknown", message: error.message || DefaultErrorMessage } };
			}
		}
	},
};

const reset = () => {
	cookies.reset();
	fetchMock.restore();
};

const waitForFetches = (milliseconds = 50) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, milliseconds);
	});
};

const mount = async (component) => {
	const mounted = enzyme.mount(component);
	await waitForFetches();
	
	return mounted;
};

// usage: top-level "describe" in all test files uses this instead
const test = (name, callback) => {
	let sandbox;			
	const sinonProxy = { 
		spy(...params) { return sandbox.spy(...params); },
		stub(...params) { return sandbox.stub(...params); } 
	};
	
	//const reset = this.reset;
	describe('EventPage', () => {
		beforeEach(() => sandbox = sinon.sandbox.create());
		afterEach(() => {
			reset();
			sandbox.restore();
		});
		
		callback(sinonProxy);
	});
};

export { cookies, mocks, waitForFetches, mount, test, reset }
