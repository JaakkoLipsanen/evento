import moment from 'moment';

// returns the current offset
const disableBodyScrolling = () => {

	// why all of these? https://dev.opera.com/articles/fixing-the-scrolltop-bug/
	const windowScroll = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	document.body.style.top = -(windowScroll) + 'px';
	document.body.style.position = "fixed";

	return windowScroll;
};

const enableBodyScrolling = (scrollValue = 0) => {
	document.body.style.position = "static";

	// why both? https://dev.opera.com/articles/fixing-the-scrolltop-bug/
	document.documentElement.scrollTop = scrollValue;
	document.body.scrollTop = scrollValue;
};

const getRelativeDay = (date) => {
	const currentDay = moment();
	const isInPast = date.isBefore(currentDay);
	const timeDifference = date.diff(currentDay, 'days');

	if(isInPast || timeDifference >= 7) {
		return date.format('MMM DD'); // "May 13"
	}

	if(timeDifference === 0) {
		return "Today";
	}
	else if(timeDifference === 1) {
		return "Tomorrow";
	}
	else { // if(timeDifference < 7) {
		return date.format('dddd'); // "Friday"
	}
};

const getRelativeDateTime = (rawEventTime) => {
	if (!rawEventTime) {
		return 'Unspecified time';
	}

	const eventTime = moment(rawEventTime)
	const day = getRelativeDay(eventTime);
	const time = eventTime.format('HH:mm');

	return `${day} at ${time}`;
}

export { disableBodyScrolling, enableBodyScrolling, getRelativeDateTime }
