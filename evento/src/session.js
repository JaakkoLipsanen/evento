import Cookie from 'js-cookie';

export default {
	isLoggedIn() {
		return Boolean(this.getAuthToken()) && Boolean(this.getUser());
	},

	getAuthToken() {
		return Cookie.get("auth_token");
	},

	getUser() {
		return JSON.parse(Cookie.get("user"));
	},

	getAuthHeader() {
		if(!this.isLoggedIn()) return { };
		return { 'Authorization': this.getAuthToken() };
	}
}
