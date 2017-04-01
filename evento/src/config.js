
const BaseURL = 'https://evento-api.herokuapp.com';
export default {
	apply() {
		const _fetch = window.fetch;
		window.fetch = (url) => _fetch(BaseURL + url);
	}
} 
