
const BaseURL = 'https://evento-api.herokuapp.com';
export default {
	apply() {
		const _fetch = window.fetch;
		window.fetch = (url, ...params) => _fetch(BaseURL + url, ...params);
	}
} 
