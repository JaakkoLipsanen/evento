import React from 'react';
import SearchBar from './';

import { createSinonSandbox, mount, renderToDOM } from '../../test-helpers';
const sinon = createSinonSandbox({ restoreAfterEachTest: true });

it('renders without crashing', () => {
	const div = document.createElement('div');
	renderToDOM(<SearchBar />, div);
});

it('calls onChange on change', async () => {
	const callback = sinon.spy();
	const changeEvent = { target: { value: 'plaa' } };
	const searchBar = await mount(<SearchBar onQueryChange={callback} />);

	expect(callback.called).toBe(false);
	searchBar.find('input').simulate('change', changeEvent);

	expect(callback.called).toBe(true);
	expect(callback.calledWith(changeEvent.target.value)).toBe(true);
});
