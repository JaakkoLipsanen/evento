import React from 'react';
import ReactDOM from 'react-dom';
import Explore from './';

import api from '../../api';
import { mount, mocks, createSinonSandbox, renderToDOM } from '../../test-helpers';

const ReturnAllFilterer = (events) => events;

describe("Explore", () => {
	const sinon = createSinonSandbox({ restoreAfterEachTest: true });

	it('renders without crashing', () => {
		const div = document.createElement('div');
		renderToDOM(<Explore filterEvents={ReturnAllFilterer} />, div);
	});

	it('shows error when getting events fails', async () => {
		sinon.stub(api, "getEvents")
			.callsFake(() => mocks.api.responses.DefaultError);

		const explore = await mount(<Explore filterEvents={ReturnAllFilterer} />)
		expect(explore.text()).toContain(api.DEFAULT_ERROR_MESSAGE);
	});

	describe("on succesful request", () => {
		beforeEach(() => {
			sinon.stub(api, "getEvents")
				.callsFake(() => mocks.api.responses.create({ events: mocks.events }));
		});

		it('sets events', async () => {
			const explore = await mount(<Explore filterEvents={ReturnAllFilterer} />)
			expect(explore.state('events')).toEqual(mocks.events);
		});

		it('calls callback on click', async () => {
			const history = { push: sinon.spy() };
			const explore = await mount(<Explore filterEvents={ReturnAllFilterer} history={history} />)
			explore.find('EventCard').at(1).simulate('click');

			expect(history.push.calledWith(`/event/${mocks.events[1].id}`)).toBe(true);
		});

		it('filters events', async () => {
			const customFilterer = (events) => events.filter(e => e === events[1]);

			const explore = await mount(<Explore filterEvents={customFilterer} />)
			const eventCards = explore.instance().filteredEvents;

			expect(eventCards).toEqual([mocks.events[1]]);
		});
	});
});
