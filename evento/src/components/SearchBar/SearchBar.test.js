import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import SearchBar from './';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<SearchBar />, div);
});

it('calls onChange on change', () => {
	const callback = sinon.spy();
	const changeEvent = { target: { value: 'plaa' } };
	const searchBar = shallow(<SearchBar onQueryChange={callback} />);

	expect(callback.called).toBe(false);
	searchBar.find('input').simulate('change', changeEvent);

	expect(callback.called).toBe(true);
	expect(callback.calledWith(changeEvent.target.value)).toBe(true);
});
