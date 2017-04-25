import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Cookie from 'js-cookie';

import './NewEventPage.css';
import 'react-datepicker/dist/react-datepicker.css';


class NewEventPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessages: null,
			title: '',
			description: '',
			category: '',
			startTime: moment().add(1, 'days'),
			endTime: null,
			location: ''
		}
	}

	handleSubmit(evt) {
		evt.preventDefault();

		fetch(`/events`, {
			method: 'POST',
			headers: { 'Authorization': Cookie.get('auth_token'), 'Content-Type': 'application/json'},
			body: JSON.stringify({
				title: this.state.title,
				description: this.state.description,
				category_id: parseInt(this.state.category, 10),
				time: this.state.startTime.format()
			})
		})
		.then(response => {
			if (!response.ok) {
				return Promise.reject(response);
			}
			// If creation was successiful, redirect to MyEvents
			this.props.history.push('/events');
		})
		.catch(res => {
			res.json().then( json => {
				const errorMessages = Object.keys(json).map(e => `${e} ${json[e]}`);
				this.setState({ errorMessages: errorMessages });
			});
		});
	}

	render () {
		let errorMessages = null;
		if (this.state.errorMessages) {
			errorMessages = this.state.errorMessages.map(error =>
				<p className="ErrorMessage" key={error}>{error}</p>
			);
		}

		return (
			<div className="NewEventPage">
				<form className="NewEventForm" onSubmit={(e) => this.handleSubmit(e)}>
					{ errorMessages }
					<label>
						Event Name
						<input type="text"
							placeholder="Add short, clear name"
							value={this.state.title}
							onChange={(evt) => this.setState({title: evt.target.value})}
						/>
						<br/>Location
						<input type="text"
							placeholder="Add address or place"
							value={this.state.location}
							onChange={(evt) => this.setState({location: evt.target.value})}
						/>
						<br/>Description
						<textarea rows="4" cols="50"
							placeholder="Tell more about this event"
							value={this.state.description}
							onChange={(evt) => this.setState({description: evt.target.value})}
						/>
						<br/>Category
						<input type="text"
							placeholder="Choose category for this event"
							value={this.state.category}
							onChange={(evt) => this.setState({category: evt.target.value})}
						/>
						<br/>
						<div className="StartTime">Start
							<DatePicker
								selected={this.state.startTime}
								onChange={(date) => this.setState({ startTime: date })}
								dateFormat="DD.MM.YYYY"
								locale='en-gb'
							/>
						</div>
						<div className="EndTime">End
							<DatePicker
								selected={this.state.endTime || this.state.startTime}
								onChange={(date) => this.setState({ endTime: date })}
								dateFormat="DD.MM.YYYY"
								locale='en-gb'
							/>
						</div>
					</label><br/>
					<input type="submit" value="Create event" />
				</form>
			</div>
		);
	}
}

export default NewEventPage;
