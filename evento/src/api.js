import Cookie from 'js-cookie';
import session from './session';

const _createErrorResult = (error) => {
	return { success: false, error: {
		type: error.type || "unknown",
		message: error.message || "Something went wrong" }
	};
}

// TODO: lots of duplicate code here!
export default {

	async getEvent(eventId) {
		try {
			const response = await fetch(`/event/${eventId}`);
			if(!response.ok) {
				throw response;
			}

			const event = await response.json();
			return { success: true, payload: { event: event } };
		}
		catch(err) {
			const error = await err.json();
			return _createErrorResult(error);
		}
	},

	async getEvents() {
		try {
			const response = await fetch('/events');
			if(!response.ok) {
				throw response;
			}

			const events = await response.json();
			return { success: true, payload: { events: events } };
		}
		catch(err) {
			const error = await err.json();
			return _createErrorResult(error);
		}
	},

	async getAttendees(eventId) {
		try {
			const response = await fetch(`/event/${eventId}/attendees`);
			if(!response.ok) {
				throw response;
			}

			const attendees = await response.json();
			return { success: true, payload: { attendees: attendees } };
		}
		catch(err) {
			const error = await err.json();
			return _createErrorResult(error);
		}
	},

	async getUserEvents() {
		// TODO: check session.isLoggedIn() ?

		const response = await fetch(`/users/${session.getUser().id}/events`);
		if(!response.ok) {
			return { success: false, error: { type: "unknown", message: "Something went wrong" } };
		}

		const events = await response.json();
		return { success: true, payload: { events: events } };
	},

	async register(name, email, password) {
		const response = await fetch('/users', {
			method: 'POST',
			body: JSON.stringify({
				name: name,
				email: email,
				password: password,
			})
		});

		if(!response.ok) {
			const error = await response.json();
			const errorMessages = Object.keys(error).map(e => `${e} ${error[e]}`);

			return { success: false, error: { type: "unknown", messages: errorMessages } };
		}

		// TODO: should the register API return the created user object?
		return { success: true, payload: { } };
	},

	async signin(email, password) {
		const response = await fetch('/authenticate', {
			method: 'POST',
			body: JSON.stringify({
				email: email,
				password: password,
			})
		});

		if(!response.ok) {
			return { success: false, error: { type: "auth", message: "Invalid credentials" } };
		}

		const json = await response.json();
		Cookie.set('auth_token', json.auth_token);
		Cookie.set('user', JSON.stringify(json.user));

		return { success: true, payload: { user: json.user, auth_token: json.auth_token } };
	}
}
