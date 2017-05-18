import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';

/* state-ly component because of the on hover behavior */
export default class AttendButton extends Component {
	constructor(props) {
		super(props);
		this.state = { hovering: false };
	}

	render() {
		const { onChange, isAttending } = this.props;
		const { hovering } = this.state;

		const showPrimaryColorByDefault = (!isAttending && hovering) || (isAttending && !hovering);
		return (
			<RaisedButton
				label={
					isAttending ?
						(hovering ? "Unattend" : "Attending") :
						(hovering ? "Attend" : "Not attending")
				}

				onClick={() => onChange(!isAttending) }
				onMouseOver={() => this.setState({ hovering: true }) }
				onMouseLeave={() => this.setState({ hovering: false }) }

				primary={showPrimaryColorByDefault}
				secondary={!showPrimaryColorByDefault}

				fullWidth={true}
				overlayStyle={{ backgroundColor: "transparent" }}
			/>
		);
	}
}
