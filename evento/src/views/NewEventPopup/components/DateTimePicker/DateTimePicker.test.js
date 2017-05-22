import React from 'react';
import ReactDOM from 'react-dom';
import DateTimePicker from './';

import { mount, renderToDOM, createSinonSandbox } from '../../../../test-helpers';

const createDate = (year, month, day) => new Date(year, month, day, 0, 0, 0);
const createTime = (hours, minutes) => new Date(0, 0, 0, hours, minutes, 0);

const sinon = createSinonSandbox({ restoreAfterEachTest: true });
describe('DateTimePicker', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		renderToDOM(<DateTimePicker />, div);
	});

	it('getDateTime merges date and time properly', async () => {
		const wrapper = await mount(<DateTimePicker />);

		const date = createDate(2017, 6, 20);
		const time = createTime(13, 25);

		wrapper.setState({ date: date, time: time });

		const merged = wrapper.node.getDateTime();
		expect(merged).toEqual(new Date(2017, 6, 20, 13, 25, 0));
	});

	it('rounds to nearest 5min on time change', async () => {
		const wrapper = await mount(<DateTimePicker />);

		const time = createTime(13, 22);
		wrapper.node.onTimeChange(time);

		expect(wrapper.state('time').getHours()).toBe(13);
		expect(wrapper.state('time').getMinutes()).toBe(20);
	});


	it('calls onTimeChange prop on time change', async () => {
		const onTimeChange = sinon.spy();
		const wrapper = await mount(<DateTimePicker onTimeChange={onTimeChange} />);

		const time = createTime(13, 22);
		wrapper.node.onTimeChange(time);

		expect(onTimeChange.calledOnce).toBe(true);
	});

	it('calls onDateChange prop on date change', async () => {
		const onDateChange = sinon.spy();
		const wrapper = await mount(<DateTimePicker onDateChange={onDateChange} />);

		const date = createDate(13, 22);
		wrapper.node.onDateChange(date);

		expect(onDateChange.calledOnce).toBe(true);
	});
});
