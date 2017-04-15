import React, { Component } from 'react';
import './SearchBar.css'

class SearchBar extends Component {
	render() {
		return (
			<div className="SearchBar">
				<input
					type="text"
					name="search"
					placeholder="search evento"
					onChange={(evt) => this.props.onQueryChange(evt.target.value)}>
				</input>
			</div>
		);
	}
}

export default SearchBar;
