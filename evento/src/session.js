import Cookie from 'js-cookie';

const parseOrNull = (obj) => Boolean(obj) ? JSON.parse(obj) : null;
export default {
	isLoggedIn() {
		return Boolean(this.getAuthToken()) && Boolean(this.getUser());
	},

	getAuthToken() {
		return parseOrNull(Cookie.get("auth_token"));
	},

	getUser() {
		return parseOrNull(Cookie.get("user"));
	},

	getAuthHeader() {
		if(!this.isLoggedIn()) return { };
		return { 'Authorization': this.getAuthToken() };
	},

	reset() {
		Cookie.remove("auth_token");
		Cookie.remove("user");
	}
}
