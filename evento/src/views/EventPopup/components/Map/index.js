import React from 'react';
import './Map.css'

/* static google maps centered on the event location */
export default ({ event, size = { width: 400, height: 250 } }) => {
	const eventLocation = event.location.replace(' ', '+');

	// google maps api key. I realize that it's not wise to put this in here,
	// but what can you do :D we could do this in back end as well but not really
	// feeling it :P
	const API_KEY = "AIzaSyAEYDif6SXl8ruGqVAUaJasxV9jarDKMk0";
	const query = `
		center=${eventLocation}&
		zoom=11&
		size=${size.width}x${size.height}&
		markers=${eventLocation}&
		key=${API_KEY}`;

	const imagePath = `https://maps.googleapis.com/maps/api/staticmap?${query}`;
	return (
		<a className="Map" target="_blank"
			href={`http://maps.google.com/?q=${eventLocation}`}
		>
			<img
				src={imagePath}
				alt=""
				style={{ width: `${size.width}px`, height: `${size.height}px` }}
			/>
		</a>
	);
};
