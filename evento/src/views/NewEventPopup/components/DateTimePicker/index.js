import React, { Component } from 'react';

import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

import './DateTimePicker.css';

class DateTimePicker extends Component {
	constructor(props) {
		super(props);
		this.state = {
			date: null,
			time: null,
			disableYearSelection: true
		};
	}

	getDateTime() {
		const date = this.state.date, time = this.state.time;
		if(!date || !time) {
			return null;
		}

		return new Date(
			date.getFullYear(), date.getMonth(), date.getDate(),
			time.getHours(), time.getMinutes(), 0
		);
	}

	getDate() { return this.state.date; }
	getTime() { return this.state.time; }
	setDate(date) { this.setState({ date: date }); }
	setTime(time) { this.setState({ time: time }); }

	onDateChange(date) {
		this.setState({ date: date });
		if(this.props.onDateChange) {
			this.props.onDateChange(date);
		}
	}

	onTimeChange(time) {
		// round to the nearest 5 min
		const minutes = time.getMinutes();
		const diff = minutes % 5;
		if(diff !== 0) {
			time.setMinutes(minutes + (diff >= 3 ? 5 - diff : -diff));
		}

		this.setState({ time: time })
		if(this.props.onTimeChange) {
			this.props.onTimeChange(time);
		}
	}

	render () {
		const styles = {
			style: { height: "62px", width: "50%" },
			inputStyle: { marginTop: "7px", width: "auto" },
			textFieldStyle: { width: "100%", height: "62px" },
			floatingLabelStyle: { top: "28px" },
			errorStyle: { bottom: "12px" },

			floatingLabelFixed: true
		};

		const datePickerStyle = {
			...styles.style,
			visibility: this.props.timeOnly ? "hidden" : "visible"
		};

		return (
			<div className="DateTimePicker">
				<DatePicker
					className="date-picker"
					floatingLabelText={this.props.dateHintText}
					errorText={this.props.errorText}
					hintText={"Enter " + (this.props.dateHintText || "value").toLowerCase()}

					value={this.state.date}
					onChange={(e, date) => this.onDateChange(date) }
					formatDate={(date) => moment(date).format('DD/MM/YYYY')}

					disableYearSelection={true}
					{...styles}
					style={datePickerStyle}
				/>

				<TimePicker
					className="time-picker"
					floatingLabelText={this.props.timeHintText}
					errorText={this.props.errorText}
					hintText={"Enter " + (this.props.timeHintText || "value").toLowerCase()}

					value={this.state.time}
					onChange={(e, time) => this.onTimeChange(time) }
					format="24hr"
					{...styles}
				/>
			</div>
		);
	}
}

export default DateTimePicker;
