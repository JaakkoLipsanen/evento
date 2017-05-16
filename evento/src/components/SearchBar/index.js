import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import './SearchBar.css'

class SearchBar extends Component {
	render() {
		const styles = {
			hintStyle: { color: "rgba(255, 255, 255, 0.825)", paddingLeft: "2px", bottom: "11px" },
			inputStyle: { color: "rgba(255, 255, 255, 0.95)", paddingLeft: "2px" },
			underlineStyle: { opacity: "0.825" },
			underlineFocusStyle: { opacity: "1" },

			fullWidth: true
		};

		return (
			<div className="SearchBar">
				<TextField
					type="text"
					name="search"
					hintText="search events"
					onChange={(e, val) => this.props.onQueryChange(val)}

					{...styles} />
			</div>
		);
	}
}

export default SearchBar;
