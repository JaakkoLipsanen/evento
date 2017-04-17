// Helper function for async fetches
global.waitForFetches = () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve();
		}, 50);
	});
};

// Create a large random integer to prevent collisions
const generateId = () => Math.round(Math.random() * Number.MAX_SAFE_INTEGER);
// Convert number to base36 string to get random combination of alphabets and numbers
const generateString = (n) => (Math.random().toString(36)+'00000000000000000').slice(2, n+2);

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

	generateUsers: (n) => {
		const users = [];
		for (let x = 0; x < n; x++) {
			users.push(Mock.generateUser());
		}
		return users;
	},

	generateCategories: (n) => {
		const categories = [];
		for (let x = 0; x < n; x++) {
			categories.push(Mock.generateCategory());
		}
		return categories;
	},

	generateEvents: (n) => {
		const events = [];
		for (let x = 0; x < n; x++) {
			events.push(Mock.generateEvent());
		}
		return events;
	}
}
