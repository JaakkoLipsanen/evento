import Cookie from 'js-cookie';
import session from './session';

const NOT_LOGGED_IN_MESSAGE = "You must be logged in";
const INVALID_CREDENTIALS_MESSAGE = "Invalid credentials";
const DEFAULT_ERROR_MESSAGE = "Something went wrong";

const SOMETHING_WENT_WRONG_ERROR = { type: "unknown", message: DEFAULT_ERROR_MESSAGE };
const NOT_LOGGED_IN_ERROR = { type: "auth", message: NOT_LOGGED_IN_MESSAGE };

const _createErrorResult = async ({ from, defaultValues = SOMETHING_WENT_WRONG_ERROR }) => {
	if(from.json) from = await from.json();
	
	const error = { ...defaultValues, ...from };
	return { success: false, error: error };
}

// TODO: some 'duplicate' code here!
export default {
	NOT_LOGGED_IN_MESSAGE: NOT_LOGGED_IN_MESSAGE,
	INVALID_CREDENTIALS_MESSAGE: INVALID_CREDENTIALS_MESSAGE,
	DEFAULT_ERROR_MESSAGE: DEFAULT_ERROR_MESSAGE,
	
	async getEvent(eventId) {
		try {
			const response = await fetch(`/events/${eventId}`);
			if(!response.ok) {
				return await _createErrorResult({ from: response });
			}

			const event = await response.json();
			return { success: true, payload: { event: event } };
		}
		catch(err) {
			return { success: false, error: SOMETHING_WENT_WRONG_ERROR };
		}
	},

	async getEvents() {
		try {
			const response = await fetch('/events');
			if(!response.ok) {
				return await _createErrorResult({ from: response });
			}

			const events = await response.json();
			return { success: true, payload: { events: events } };
		}
		catch(err) {
			return { success: false, error: SOMETHING_WENT_WRONG_ERROR };
		}
	},

	async getAttendees(eventId) {
		try {
			const response = await fetch(`/events/${eventId}/attendees`);
			if(!response.ok) {
				return await _createErrorResult({ from: response });
			}

			const attendees = await response.json();
			return { success: true, payload: { attendees: attendees } };
		}
		catch(err) {
			return { success: false, error: SOMETHING_WENT_WRONG_ERROR };
		}
	},

	// TODO: check session.isLoggedIn() ?
	async getUserEvents() {
		if(!session.getUser()) {
			return { success: false, error: NOT_LOGGED_IN_ERROR };
		}

		try {
			const response = await fetch(`/users/${session.getUser().id}/events`);
			if(!response.ok) {
				return await _createErrorResult({ from: response });
			}

			const events = await response.json();
			return { success: true, payload: { events: events } };
		}
		catch(err) {
			return { success: false, error: SOMETHING_WENT_WRONG_ERROR };
		}
	},

	async updateIsAttending(eventId, isAttending) {
		if(!session.getUser()) {
			return { success: false, error: NOT_LOGGED_IN_ERROR };
		}

		try {
			const response = await fetch(`/events/${eventId}/attendees`, {
				method: isAttending ? 'POST' : 'DELETE'
			});

			if (!response.ok) {
				return await _createErrorResult({ from: response });
			}

			return { success: true, payload: { } };
		}
		catch(err) {
			return { success: false, error: SOMETHING_WENT_WRONG_ERROR };
		}
	},

	async register(name, email, password) {
		try {
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
				const errorMessages = Object.keys(error).map(key => error[key].map(value => `${key} ${value}`));
				const flattened = [].concat.apply([], errorMessages);

				return { success: false, error: { type: "unknown", messages: flattened } };	
			}

			// TODO: should the register API return the created user object?
			return { success: true, payload: { } };
		}
		catch(err) {
			return { success: false, error: SOMETHING_WENT_WRONG_ERROR };
		}
	},

	async signin(email, password) {
		try {
			const response = await fetch('/authenticate', {
				method: 'POST',
				body: JSON.stringify({
					email: email,
					password: password,
				})
			});

			if(!response.ok) {
				return await _createErrorResult({ from: response, defaultValues: { type: "auth", message: INVALID_CREDENTIALS_MESSAGE } });
			}

			const json = await response.json();
			Cookie.set('auth_token', JSON.stringify(json.auth_token));
			Cookie.set('user', JSON.stringify(json.user));

			return { success: true, payload: { user: json.user, auth_token: json.auth_token } };
		}
		catch(err) {
			return { success: false, error: SOMETHING_WENT_WRONG_ERROR };
		}
	}
}
