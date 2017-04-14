import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import sinon from 'sinon';
import TabContainer from './';

const tabs = [
	{ title: "test1", path: "/test1" },
	{ title: "test2", path: "/test2" }
];

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<TabContainer tabs={tabs} />, div);
});

it('renders tab with correct title', () => {
	const tabContainer = mount(<TabContainer tabs={tabs} />);
	expect(tabContainer.find('Tab').at(0).text()).toEqual(tabs[0].title);
});

it('calls callback on tab change', () => {
	const callback = sinon.spy();
	const tabContainer = mount(<TabContainer tabs={tabs} onSelectedTabChange={callback}/>);
	tabContainer.find('Tab').at(1).simulate('click');

	expect(callback.called).toBe(true);
	expect(tabContainer.state('selected')).toEqual(tabs[1]);
});

it('does callback on tab change', () => {
	const callback = sinon.spy();
	const tabContainer = mount(<TabContainer tabs={tabs} onSelectedTabChange={callback}/>);

	tabContainer.find('Tab').at(1).simulate('click');
	tabContainer.find('Tab').at(1).simulate('click');

	expect(callback.calledOnce).toBe(true);
});
