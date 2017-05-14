import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './index.css';

import App from './views/App';
import config from './config';

// apply config.js
config.apply();

ReactDOM.render(
	// for material-ui
	<MuiThemeProvider>
		<App />
	</MuiThemeProvider>,
	document.getElementById('root')
);
