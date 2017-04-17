import React from 'react';
import ReactDOM from 'react-dom';
import MainPage from './';

import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock';
import sinon from 'sinon';

const eventMocks = Mock.generateEvents(5);

const DefaultEntries = undefined;
const DefaultLocation = { pathname: '/' };
const DefaultHistory = { push: (url) => { } };

const mountMainPage = (initialEntries = DefaultEntries, location = DefaultLocation, history = DefaultHistory) => {

	const mainPageWrapper = mount(
		(<MemoryRouter initialEntries={initialEntries}>
			<MainPage location={location} history={history} />
		</MemoryRouter>));

	return mainPageWrapper.find('MainPage').at(0);
};

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(
		(<MemoryRouter>
			<MainPage location={{ pathname: '/explore' }} />
		</MemoryRouter>), div);
});

it('displays Explore if path is \'/\'', async () => {
	const location = { pathname: '/' };
	const mainPage = mountMainPage(
		[location.pathname],
		location
	);

	await waitForFetches();

	expect(mainPage.find('Explore').length).toEqual(1);
	expect(mainPage.find('MyEvent').length).toEqual(0);
});

it('displays My Events if path is \'/events\'', async () => {
	const location = { pathname: '/events' };
	const mainPage = mountMainPage(
		[location.pathname],
		location
	);

	await waitForFetches();

	expect(mainPage.find('MyEvents').length).toEqual(1);
	expect(mainPage.find('Explore').length).toEqual(0);
});

it('by default doesn\'t filter anything', async () => {
	const mainPage = mountMainPage();
	await waitForFetches();

	const filterer = mainPage.node.state.filterer;
	expect(filterer(eventMocks)).toEqual(eventMocks);
});

it('filters events correctly', async () => {
	const mainPage = mountMainPage();
	await waitForFetches();

	mainPage.node.updateFilter("piano");
	expect(mainPage.node.state.filterer(eventMocks))
	.toEqual(eventMocks.filter(event => event.title.toLowerCase().includes("piano")));

	mainPage.node.updateFilter("lesson");
	expect(mainPage.node.state.filterer(eventMocks))
	.toEqual(eventMocks.filter(event => event.description.includes("lesson")));

	mainPage.node.updateFilter("SPORTS");
	expect(mainPage.node.state.filterer(eventMocks))
	.toEqual(eventMocks.filter(event => event.category.name.toLowerCase().includes("sports")));
});

it('reacts to SearchBar change', async () => {
	const mainPage = mountMainPage();
	await waitForFetches();

	const searchBar = mainPage.find('SearchBar').at(0);
	const searchBarInput = searchBar.find('input');
	searchBarInput.simulate('change', { target: { value: 'music' } });

	expect(mainPage.node.state.filterer(eventMocks))
	.toEqual(eventMocks.filter(event => event.category.name.toLowerCase().includes("music")));
});

it('changes path after tab is clicked', async () => {
	const location = { pathname: '/events' };
	const history = { push: sinon.spy() };

	const mainPage = mountMainPage(undefined, location, history);
	await waitForFetches();

	mainPage.find('Tab').at(0).simulate('click');
	expect(history.push.calledOnce).toBe(true);
});
