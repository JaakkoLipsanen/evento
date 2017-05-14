import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './index.css';

import App from './views/App';
import config from './config';

// https://github.com/zilverline/react-tap-event-plugin
// removes 300ms tap delay on some mobile devices, like iOS
// this is a requirement for some of the material-ui components to work
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

// apply config.js
config.apply();

ReactDOM.render(
	// for material-ui
	<MuiThemeProvider>
		<App />
	</MuiThemeProvider>,
	document.getElementById('root')
);
