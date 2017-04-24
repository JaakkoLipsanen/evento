import React from 'react';
import ReactDOM from 'react-dom';
import Cookie from 'js-cookie';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';
import { mount } from 'enzyme';
import MyEvents from './';

const eventMocks = Mock.generateEvents(5);
const userMock = Mock.generateUser();

const UserAuthToken = "token_token";
const setCookies = (user = userMock, userAuthToken = UserAuthToken) => {
	Cookie.set("user", user);
	Cookie.set("auth_token", userAuthToken);
};

fetchMock.get(`/users/${userMock.id}/events`, (url, opts) => {
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
	Cookie.remove("user");
	Cookie.remove("auth_token");

	const myEventsPage = mount(<MyEvents />);
	await waitForFetches();

	expect(myEventsPage.text()).toEqual("You are not logged in. Please login again");
});

it('shows error if given incorrect parameters', async () => {
	setCookies(userMock, "wrong_auth_token");

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
