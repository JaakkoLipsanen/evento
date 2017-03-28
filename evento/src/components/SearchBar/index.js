import React, { Component } from 'react';
import './SearchBar.css'

class SearchBar extends Component {
	render() {
		return (
			<div className="SearchBar">
				<input type="text" name="search"></input>
			</div>
		);
	}
}

export default SearchBar;
