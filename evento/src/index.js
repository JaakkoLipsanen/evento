import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './views/App';
import config from './config';

// apply config.js
config.apply();

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
