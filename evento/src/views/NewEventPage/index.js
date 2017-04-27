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
			categories: [],
			title: '',
			description: '',
			category: '',
			startTime: moment().add(1, 'days'),
			endTime: null,
			location: ''
		}
	}

	componentDidMount() {
		fetch(`/categories`)
		.then(response => {
			if (response.ok) {
				return response.json();
			}
			else {
				Promise.reject(response)
			}
		})
		.then(categories => this.setState({ categories: categories }))
		.catch(this.setErrorMessages);
	}

	handleSubmit(evt) {
		evt.preventDefault();

		const category = this.state.categories
			.find(c => c.name === this.state.category);

		if (category === undefined) {
			this.setState({ errorMessages: ['Category not found'] });
			return;
		}

		fetch(`/events`, {
			method: 'POST',
			headers: { 'Authorization': Cookie.get('auth_token'), 'Content-Type': 'application/json'},
			body: JSON.stringify({
				title: this.state.title,
				description: this.state.description,
				category_id: category.id,
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
		.catch(this.setErrorMessages);
	}

	setErrorMessages(response) {
		response.json()
		.then( json => {
			const errorMessages = Object.keys(json).map(e => `${e} ${json[e]}`);
			this.setState({ errorMessages: errorMessages });
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
						<label>Event Name</label>
						<input type="text"
							className="title-input"
							placeholder="Add short, clear name"
							value={this.state.title}
							onChange={(evt) => this.setState({title: evt.target.value})}
						/>
						
						<label>Location</label>
						<input type="text"
							className="location-input"
							placeholder="Add address or place"
							value={this.state.location}
							onChange={(evt) => this.setState({location: evt.target.value})}
						/>
						
						<label>Description</label>
						<textarea rows="4" cols="50"
							className="description-input"
							placeholder="Tell more about this event"
							value={this.state.description}
							onChange={(evt) => this.setState({description: evt.target.value})}
						/>
						
						<label>Category</label>
						<input list="categories"
							className="category-input"
							onChange={evt => this.setState({category: evt.target.value})}
						/>
						<datalist id="categories">
							{ this.state.categories.map(category =>
								<option key={category.id} value={category.name} />
							)}
						</datalist>
						
						<div className="time-picker-container">
							<label>Start Time</label>
							<DatePicker
								selected={this.state.startTime}
								onChange={(date) => this.setState({ startTime: date })}
								dateFormat="DD.MM.YYYY"
								locale='en-gb'
								className="DatePicker"
							/>
						</div>
						<div className="time-picker-container">
							<label>End Time</label>
							<DatePicker
								selected={this.state.endTime || this.state.startTime}
								onChange={(date) => this.setState({ endTime: date })}
								dateFormat="DD.MM.YYYY"
								locale='en-gb'
								className="DatePicker"
							/>
						</div>
					<input type="submit" value="Create event" />
				</form>
			</div>
		);
	}
}

export default NewEventPage;
