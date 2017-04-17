import React from 'react';
import ReactDOM from 'react-dom';
import Cookie from 'js-cookie';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import { mount } from 'enzyme';
import MyEvents from './';

const eventMocks = Mock.generateEvents(5);

const UserID = 5;
const UserAuthToken = "token_token";
const setCookies = (userID = UserID, userAuthToken = UserAuthToken) => {
	Cookie.set("userId", userID);
	Cookie.set("auth_token", userAuthToken);
};

fetchMock.get(`/users/${UserID}/events`, (url, opts) => {
	if(!opts.headers || opts.headers.Authorization !== UserAuthToken) {
		return { throws: 401 };
	}

	return eventMocks;
});

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<MyEvents />, div);
});

it('shows error if user is not logged in', async () => {
	Cookie.remove("userId");
	Cookie.remove("auth_token");

	const myEventsPage = mount(<MyEvents />);
	await waitForFetches();

	expect(myEventsPage.text()).toEqual("You are not logged in. Please login again");
});

it('shows error if given incorrect parameters', async () => {
	setCookies(UserID, "wrong_auth_token");

	const myEventsPage = mount(<MyEvents />);
	await waitForFetches();

	expect(myEventsPage.text()).toEqual("Something went wrong");
});

it('shows events if user is logged in', async () => {
	setCookies();

	const myEventsPage = mount(<MyEvents />);
	await waitForFetches();

	expect(myEventsPage.state('events')).toEqual(eventMocks);
	expect(myEventsPage.find('EventCard').length).toEqual(eventMocks.length);
});


it('updates history when event is clicked', async () => {
	setCookies();

	const history = { push: sinon.spy() };
	const myEventsPage = mount(<MyEvents history={history} />);
	await waitForFetches();

	myEventsPage.find('EventCard').at(1).simulate('click');
	expect(history.push.calledWith(`/event/${eventMocks[1].id}`)).toBe(true);
});
