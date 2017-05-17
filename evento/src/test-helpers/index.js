import * as enzyme from 'enzyme';
import sinon from 'sinon';
import Cookie from 'js-cookie';
import fetchMock from 'fetch-mock';

import React, { PropTypes } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import mockFactory from './mock-factory';
import api from '../api';

const cookies = {
	set(cookies) {
		for(let param of Object.keys(cookies)) {
			Cookie.set(param, JSON.stringify(cookies[param]));
		}
	},

	reset() {
		for(let cookie of Object.keys(Cookie.get())) {
			Cookie.remove(cookie);
		}
	}
};

const mocks = {
	// destructures all values (event, events, user, users etc) to this object.
	...mockFactory.createAllMocks(),

	generate: {
		// usage: mocks.generate.user() etc
		...mockFactory.getCreateFunctions()
	},

	api: {
		responses: {
			get DefaultError() {
				return this.createError({ });
			},

			get DefaultSuccess() {
				return this.create({ });
			},

			create(payload) {
				return { success: true, payload: payload };
			},

			createError(error) {
				return { success: false, error: { type: "unknown", message: api.DEFAULT_ERROR_MESSAGE, ...error } };
			}
		}
	},
};

const waitForFetches = (milliseconds = 50) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, milliseconds);
	});
};

const mount = async (component) => {
	const muiTheme = getMuiTheme();
	const mounted = enzyme.mount(component, {
		context: { muiTheme },
		childContextTypes: {muiTheme: React.PropTypes.object}
	});

	await waitForFetches();

	mounted.wait = waitForFetches;
	return mounted;
};

const renderToDOM = async (component, domElement) => {
	ReactDOM.render(
		<MuiThemeProvider>{ component }</MuiThemeProvider>,
		domElement
	);
};

const ApiFunctionNames = Object.getOwnPropertyNames(api).filter((p) =>  typeof api[p] === 'function');
const ApiFunctionValues = ApiFunctionNames.reduce((map, name) => { map[name] = api[name]; return map; }, { });

const MockAllApiCalls = (mockFunc) => ApiFunctionNames.forEach((name) => api[name] = () => mockFunc(name));
const RestoreAllApiCalls = () => ApiFunctionNames.forEach((name) => api[name] = ApiFunctionValues[name]);

const createSinonSandbox = ({ restoreAfterEachTest, throwIfApiNotMocked = true }) => {
	let sandbox;
	const sinonProxy = {
		get match() { return sandbox.match; },
		spy(...params) { return sandbox.spy(...params); },
		stub(...params) { return sandbox.stub(...params); },
		restore() { return sandbox.restore(); }
	};

	if(restoreAfterEachTest) {
		beforeEach(() => sandbox = sinon.sandbox.create());
		afterEach(() => { sandbox.restore(); });
	}

	if(throwIfApiNotMocked) {
		if(!restoreAfterEachTest) {
			throw new Error("Auto-mocking api to throw is not supported if sinon will not be restored after each test");
		}

		beforeEach(() => MockAllApiCalls(name => mocks.api.responses.createError({ message: `API call ${name} is not mocked!` })));
		afterEach(() => RestoreAllApiCalls());
	}

	return sinonProxy;
};

export { cookies, mocks, mount, createSinonSandbox, renderToDOM }
