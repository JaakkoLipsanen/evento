import React, { Component } from 'react';
import DateTimePicker from 'react-datetime';
import moment from 'moment';
import Cookie from 'js-cookie';

import './NewEventPage.css';
import './react-datetime.css';

// allow increasing minutes only in steps of 5min
const TimePickerConstraints = { minutes: { step: 5 } };
const validateIsFuture = (current, selected) => {
	 return current.isAfter(moment().subtract(1, 'day'))
};

const TimePicker = ({ initialValue, onChange }) =>
	(<DateTimePicker
		value={initialValue}
		onChange={onChange}

		dateFormat="DD.MM.YYYY"
		locale='en-gb'
		timeConstraints={TimePickerConstraints}
		isValidDate={validateIsFuture}
		className="DatePicker"
	/>);

const defaultStartTime = () => moment().add(1, 'day').set({ hour: 18, minute: 0 });
const defaultEndTime = () => defaultStartTime().add(1, 'hour');

class NewEventPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorMessages: null,
			categories: [],
			title: '',
			description: '',
			category: '',
			location: '',

			startTime: defaultStartTime(),
			endTime: defaultEndTime()
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
		.catch(response => this.setErrorMessages(response));
	}

	handleSubmit(evt) {
		evt.preventDefault();

		const category = this.state.categories.find(c => c.name === this.state.category);
		if (!category) {
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

			// TODO: should redirect to the event page
			// If creation was successful, redirect to MyEvents
			this.props.history.push('/events');
		})
		.catch(response => this.setErrorMessages(response));
	}

	setStartTime(newTime) {
		this.setState({ startTime: newTime }, () => {
			if(this.state.endTime.isBefore(newTime)) {
				this.setState({ endTime: newTime.clone().add(1, 'hour') });
			}
		});
	}

	setEndTime(newTime) {
		this.setState({ endTime: newTime }, () => {
			if(this.state.startTime.isAfter(newTime)) {
				this.setState({ startTime: newTime.clone().subtract(1, 'hour') });
			}
		});
	}

	setErrorMessages(response) {
		response.json()
		.then(json => {
			// the errors come in { 'name', ['too short', 'already taken'] } format
			const errorMessagesByField =
				Object.keys(json)
				.map(e => json[e].map(error => `${e} ${error}`));

			const flattened = [].concat.apply([], errorMessagesByField);
			this.setState({ errorMessages: flattened });
		});
	}

	render () {
		let errorMessages = (this.state.errorMessages || [])
			.map(error => <p className="ErrorMessage" key={error}>{error}</p> );

		return (
			<div className="NewEventPage">
				<form className="NewEventForm" onSubmit={(e) => this.handleSubmit(e)}>
					{ errorMessages }

					<label>Event Name</label>
					<input type="text"
						className="title-input"
						placeholder="Add short, clear name"
						value={this.state.title}
						onChange={(evt) => this.setState({ title: evt.target.value })}
					/>

					<label>Location</label>
					<input type="text"
						className="location-input"
						placeholder="Add address or place"
						value={this.state.location}
						onChange={(evt) => this.setState({ location: evt.target.value })}
					/>

					<label>Description</label>
					<textarea rows="4" cols="50"
						className="description-input"
						placeholder="Tell more about this event"
						value={this.state.description}
						onChange={(evt) => this.setState({ description: evt.target.value })}
					/>

					<label>Category</label>
					<input list="categories"
						className="category-input"
						onChange={evt => this.setState({ category: evt.target.value })}
					/>
					<datalist id="categories">
						{ this.state.categories.map(category =>
							<option key={category.id} value={category.name} />
						)}
					</datalist>

					<div className="start-time-picker-container">
						<label>Start Time</label>
						<TimePicker
							initialValue={this.state.startTime}
							onChange={(date) => this.setStartTime(date)}
						/>
					</div>

					<div className="end-time-picker-container">
						<label>End Time</label>
						<TimePicker
							initialValue={this.state.endTime}
							onChange={(date) => this.setEndTime(date)}
						/>
					</div>

					<input type="submit" value="Create event" />
				</form>
			</div>
		);
	}
}

export default NewEventPage;
