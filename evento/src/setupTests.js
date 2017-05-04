import Cookie from 'js-cookie';
import fetchMock from 'fetch-mock';

// Helper function for async fetches
global.wait = (milliseconds = 50) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, milliseconds);
	});
};

// TODO: remove waitForFetches completely?
global.waitForFetches = global.wait;

// Create a large random integer to prevent collisions
const generateId = () => Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
// Convert number to base36 string to get random combination of alphabets and numbers
const generateString = (n) => (Math.random().toString(36)+'00000000000000000').slice(2, n+2);

const DefaultErrorMessage = "Something went wrong";
// Factories

global.Mock = {
	generateUser: () => {
		return {
			id: generateId(),
			name: generateString(15),
			email: `${generateString(15)}@example.com`
		}
	},

	generateCategory: () => {
		return {
			id: generateId(),
			name: generateString(15),
			parent_id: null
		}
	},

	generateEvent: () => {
		return {
			id: generateId(),
			title: generateString(15),
			description: generateString(50),
			category: Mock.generateCategory(),
			creator: Mock.generateUser()
		}
	},

	generateUsers: (n = 10) => {
		const users = [];
		for (let x = 0; x < n; x++) {
			users.push(Mock.generateUser());
		}
		return users;
	},

	generateCategories: (n = 10) => {
		const categories = [];
		for (let x = 0; x < n; x++) {
			categories.push(Mock.generateCategory());
		}
		return categories;
	},

	generateEvents: (n = 10) => {
		const events = [];
		for (let x = 0; x < n; x++) {
			events.push(Mock.generateEvent());
		}
		return events;
	},

	setCookies(params) {
		for(let param of Object.keys(params)) {
			Cookie.set(param, JSON.stringify(params[param]));
		}
	},

	resetMocksAndCookies() {
		// TODO: sinon.restore()?
		fetchMock.restore();
		this.resetCookies();
	},

	resetCookies() {
		Object.keys(Cookie.get()).forEach(function(cookie) {
			Cookie.remove(cookie);
		});
	},
}
