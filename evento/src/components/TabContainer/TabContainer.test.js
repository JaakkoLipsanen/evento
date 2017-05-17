import React from 'react';
import TabContainer from './';

import { createSinonSandbox, mount, renderToDOM } from '../../test-helpers';
const sinon = createSinonSandbox({ restoreAfterEachTest: true });

const tabs = [
	{ title: "test1", path: "/test1" },
	{ title: "test2", path: "/test2" }
];

it('renders without crashing', () => {
	const div = document.createElement('div');
	renderToDOM(<TabContainer tabs={tabs} />, div);
});

it('renders tab with correct title', async () => {
	const tabContainer = await mount(<TabContainer tabs={tabs} />);
	expect(tabContainer.find('Tab').at(0).text()).toEqual(tabs[0].title);
});

it('calls callback on tab change', async () => {
	const callback = sinon.spy();
	const tabContainer = await mount(<TabContainer tabs={tabs} onSelectedTabChange={callback}/>);
	tabContainer.find('Tab').at(1).simulate('click');

	expect(callback.called).toBe(true);
	expect(tabContainer.state('selected')).toEqual(tabs[1]);
});

it('does callback on tab change', async () => {
	const callback = sinon.spy();
	const tabContainer = await mount(<TabContainer tabs={tabs} onSelectedTabChange={callback}/>);

	tabContainer.find('Tab').at(1).simulate('click');
	tabContainer.find('Tab').at(1).simulate('click');

	expect(callback.calledOnce).toBe(true);
});
