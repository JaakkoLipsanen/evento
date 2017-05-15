import React, { Component } from 'react';

import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui/svg-icons/action/settings';

import session from '../../../../session';

class ProfileMenu extends Component {
	constructor() {
		super();
		this.state = { open: false };
	}

	signOut() {
		session.reset(); // is this enough? no need to inform backend, right?
		window.location.replace('/evento'); // refresh tab and return to main page
	}

	render() {
		const buttonStyle = { width: "auto", height: "auto", padding: "0px"};
		const iconStyle = { fill: 'white', width: "32px", height: "32px", padding: "4px" };

		return (
			<div className="ProfileMenu">
				<IconMenu
					iconStyle={iconStyle}
					iconButtonElement={
						<IconButton style={buttonStyle} tooltip="Settings" tooltipPosition="bottom-left">
							<SettingsIcon/>
						</IconButton>
					}

					anchorOrigin={{horizontal: 'right', vertical: 'top'}}
					targetOrigin={{horizontal: 'right', vertical: 'top'}}

					open={this.state.open}
					onRequestChange={() => this.setState({ open: !this.state.open })}
				>
					<MenuItem primaryText="Profile" disabled={true} />
					<MenuItem primaryText="Settings" disabled={true} />
					<MenuItem primaryText="Help" disabled={true} />
					<MenuItem primaryText="Sign out" onClick={() => this.signOut()} />
				</IconMenu>
			</div>
		);
	}
}

export default ProfileMenu;
