import React, { Component } from 'react';

import Paper from 'material-ui/Paper';
import { Scrollbars } from 'react-custom-scrollbars';

import { enableBodyScrolling, disableBodyScrolling } from '../../helper'
import './Popup.css';

class Popup extends Component {
	constructor(props) {
		super(props);
		this.state = { open: false };
	}

	show() {
		this.setState({ open: true });

		/* disable body scrolling (aka scrolling on the main page)
		   and save the body scroll value to this.windowScroll */
		this.windowScroll = disableBodyScrolling();
	}

	close() {
		this.setState({ open: false })
		enableBodyScrolling(this.windowScroll); // re-enable body scrolling
	}

	render() {
		const parentDivOnClick = () => this.props.closeOnOutsideClick && this.close();
		const parentDivStyle = {
			visibility: this.state.open ? "visible" : "hidden",
			opacity: this.state.open ? 1 : 0
		 };

		// fade the position to the center from above
		const popupDivStyle = { marginTop: this.state.open ? "50vh" : "35vh" };
		return (
			<div className="Popup" onClick={parentDivOnClick} style={parentDivStyle}>
				<Paper
					className="popup-container"
					zDepth={5}
					style={popupDivStyle}
					onClick={e => e.stopPropagation() }
				>
					<Scrollbars
						autoHide
						autoHeight
						autoHeightMin={100}
						autoHeightMax={"96.5vh"}
					>
						{ this.props.children }
					</Scrollbars>
				</Paper>
			</div>
		);
	}
}

export default Popup;
