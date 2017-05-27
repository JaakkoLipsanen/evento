// Create a large random integer to prevent collisions
const generateId = () =>
	Math.round(Math.random() * Number.MAX_SAFE_INTEGER);

// Convert number to base36 string to get random combination of alphabets and numbers
const generateString = (n) =>
	(Math.random().toString(36) + '00000000000000000').slice(2, n + 2);

// Return ISO time stamp
const generateTimeStamp = (dayOffset = 2) => {
	const dayAfterTomorrow = new Date();
	dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + dayOffset);
	return dayAfterTomorrow.toISOString();
}

export default {
	createUser() {
		return {
			id: generateId(),
			name: generateString(15),
			email: `${generateString(15)}@example.com`
		}
	},

	createAttendee() {
		return this.createUser();
	},

	createCategory() {
		return {
			id: generateId(),
			name: generateString(15),
			parent_id: null
		}
	},

	createEvent() {
		return {
			id: generateId(),
			title: generateString(15),
			description: generateString(50),
			category: this.createCategory(),
			creator: this.createUser(),
			location: generateString(15),
			time: generateTimeStamp(),
		}
	},

	createUsers(n = 10) {
		let users = [];
		for(let i = 0; i < n; i++) users.push(this.createUser());

		return users;
	},

	createAttendees(n = 10) {
		return this.createUsers(n);
	},

	createCategories(n = 10) {
		let categories = [];
		for(let i = 0; i < n; i++) categories.push(this.createCategory());

		return categories;
	},

	createEvents(n = 10) {
		let events = [];
		for(let i = 0; i < n; i++) events.push(this.createEvent());

		return events;
	},

	createAllMocks() {
		return {
			event: this.createEvent(),
			events: this.createEvents(10),
			user: this.createUser(),
			users: this.createUsers(5),
			attendee: this.createAttendee(),
			attendees: this.createAttendees(5),
			category: this.createCategory(),
			categories: this.createCategories(10),
		};
	},

	getCreateFunctions() {
		return {
			event: this.createEvent,
			events: this.createEvents,
			user: this.createUser,
			users: this.createUsers,
			attendee: this.createAttendee,
			attendees: this.createAttendees,
			category: this.createCategory,
			categories: this.createCategories,
		};
	}
};
