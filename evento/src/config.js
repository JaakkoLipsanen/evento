
import session from './session';

const BaseURL = 'https://evento-api.herokuapp.com';
const getDefaultHeaders = () => {

	const AuthHeader = session.isLoggedIn() ?
		session.getAuthHeader() : { };

	const CommonHeaders = {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin':'*'
	};

	return { ...AuthHeader, ...CommonHeaders };
};

export default {
	apply() {
		const _fetch = window.fetch;
		window.fetch = (url, ...params) => {
			const parameters = { headers: getDefaultHeaders(), ...params  };
			return _fetch(BaseURL + url, parameters);
		};
	},

	BaseURL: BaseURL
}
