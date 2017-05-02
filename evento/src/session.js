import Cookie from 'js-cookie';

export default {
	isLoggedIn() {
		return Boolean(this.getAuthToken()) && Boolean(this.getUser());
	},

	getAuthToken() {
		return Cookie.get("auth_token");
	},

	getUser() {
		const cookie = Cookie.get("user");
		if(!cookie) {
			return null;
		}
		
		return JSON.parse(cookie);
	},

	getAuthHeader() {
		if(!this.isLoggedIn()) return { };
		return { 'Authorization': this.getAuthToken() };
	}
}
