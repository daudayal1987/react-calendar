import React, { Component } from 'react';
import moment from 'moment';

class TimePicker extends Component {
    constructor(props){
        super(props);
        // console.log(props)
    }

    isEarlierThanEndLimit(timeValue, endLimit, lastValue) {
		let timeValueIsEarlier = moment(timeValue, 'hh:mmA').diff(moment(endLimit, 'hh:mmA')) < 0
		let timeValueIsLaterThanLastValue = lastValue === undefined ? true : moment(lastValue, 'hh:mmA').diff(moment(timeValue, 'hh:mmA')) < 0
		return timeValueIsEarlier && timeValueIsLaterThanLastValue;
	}

	render () {
		let timeValue = this.props.beginLimit || "12:00AM";
		let lastValue;
        let endLimit = this.props.endLimit || "11:59PM";
		let step = this.props.step || 15;

		var options = [];
		// options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>);

        while ( this.isEarlierThanEndLimit(timeValue, endLimit, lastValue) ) {
            // console.log(timeValue, moment(timeValue, 'h:mmA').diff(moment(endLimit, 'hh:mmA'), 'minutes'));
            options.push(<option key={timeValue} value={timeValue}>{timeValue}</option>)
            lastValue = timeValue;
            timeValue = moment(timeValue, 'hh:mmA').add(step, 'minutes').format('hh:mmA');
        }
        return(
            <select {...this.props}>
                {options}
            </select>
        )
	}
}

export default TimePicker;