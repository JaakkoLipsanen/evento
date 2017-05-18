import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import DateTimePicker from './components/DateTimePicker';

import moment from 'moment';
import api from '../../api';

import './NewEventPopup.css';

class NewEventPopup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [],
			title: '',
			description: '',
			category: null,
			location: '',

			errorMessage: null, // singular error, like "Server not responding"
			fieldErrors: { }, // field specific error, like "category not found"
			open: false,
		}
	}

	show() {
		this.setState({ open: true });
	}

	close() {
		this.setState({ open: false })
	}

	componentDidMount() {
		this.fetchCategories();
	}

	async fetchCategories() {
		const result = await api.getCategories();
		if(result.success) {
			this.setState({ categories: result.payload.categories });
		}
		else {
			this.setState({ errorMessage: result.error.message });
		}
	}

	async createEvent() {
		const category = this.state.categories.find(c => c.name === this.state.category);
		if (!category) {
			this.setState({ fieldErrors: { category: 'Category not found' } });
			return;
		}

		if(!this.startTimePicker.dateTime) {
			this.setState({ fieldErrors: { time: 'Time must be set' } });
			return;
		}

		console.log(category);
		const result = await api.createNewEvent({
			title: this.state.title,
			description: this.state.description,
			categoryId: category.id,
			startTime: moment(this.startTimePicker.dateTime).format()
		});

		if(result.success) {
			// TODO: should redirect to the page of the newly created event?
			// If creation was successful, redirect to MyEvents
			this.props.history.push('/events');
		}
		else {
			this.setErrors(result.error);
			this.setState({ errorMessages: result.error.messages });
		}
	}

	setErrors(error) {
		// singular error, if the problem is "Server not responding" for example
		this.setState({ errorMessage: error.message });

		// errors with the submitted fields
		if(error.messages && error.messages.raw) {
			const raw = error.messages.raw;
			const getErr = (field) => field ? field[0] : undefined;

			this.setState({
				fieldErrors: {
					title: getErr(raw.title),
					description: getErr(raw.description),
					category: getErr(raw.category),
					time: getErr(raw.time),
				}
			});
		}
	}

	render () {
		const styles = {
			style: { height: "62px" },
			inputStyle: { "margin-top": "7px" },
			textareaStyle: { "margin-top": "26px", "margin-bottom": "-26px" },
			floatingLabelStyle: { top: "28px" },
			errorStyle: { bottom: "10px" },
			fullWidth: true
		};

		let errorMessages = (this.state.errorMessages || [])
			.map(error => <p className="ErrorMessage" key={error}>{error}</p> );

		return (
			<div
				className="NewEventPopup"
				style={{ display: this.state.open ? "block" : "none" }}>

				<form className="NewEventForm" onSubmit={(e) => this.handleSubmit(e)}>
					{ errorMessages }

					<TextField
						floatingLabelText="Event name"
						floatingLabelFixed={true}
						hintText="Name should be short and clear"
						errorText={this.state.fieldErrors.title}

						value={this.state.title}
						onChange={(evt) => this.setState({ title: evt.target.value })}
						{...styles} />

					<TextField
						floatingLabelText="Location"
						floatingLabelFixed={true}
						hintText="Address or place"
						errorText={this.state.fieldErrors.location}

						value={this.state.location}
						onChange={(evt) => this.setState({ location: evt.target.value })}
						{...styles} />

					<TextField
						floatingLabelText="Description"
						hintText="Tell more about this event"
						errorText={this.state.fieldErrors.description}
						floatingLabelFixed={true}

						value={this.state.description}
						multiLine={true}
						rows={1}

						onChange={(evt) => this.setState({ description: evt.target.value })}
						{...styles} />


					<SelectField
						floatingLabelText="Category"
						floatingLabelFixed={true}
						errorText={this.state.fieldErrors.category}

						value={this.state.category}
						onChange={(e, i, val) => this.setState({ category: val })}
						{...styles}
					>
						{ this.state.categories.map(category =>
							<MenuItem key={category.id} value={category.name} primaryText={category.name} />
						)}
					</SelectField>

					<DateTimePicker
						onChange={(date) => this.setStartTime(date)}
						ref={picker => this.startTimePicker = picker}

						dateHintText="Start date"
						timeHintText="Start time"
						errorText={this.state.fieldErrors.time}
					/>

					<DateTimePicker
						onChange={(date) => this.setEndTime(date)}
						ref={picker => this.endTimePicker = picker}

						dateHintText="End date"
						timeHintText="End time"
					/>

					<div style={{ display: "flex" }}>
						<RaisedButton
							label="Create Event"
							primary={true}
							style={{ marginTop: "16px", marginRight: "4px", width: "50%" }}
							onClick={() => this.createEvent()} />

						<RaisedButton
							label="Cancel"
							style={{ marginTop: "16px", marginLeft: "4px", width: "50%" }}
							onClick={() => this.close()} />
					</div>
				</form>
			</div>
		);
	}
}

export default NewEventPopup;
