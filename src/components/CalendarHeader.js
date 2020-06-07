import React, { Component } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import TimePicker from './TimePicker';

import {prevWeek, nextWeek, toggleWeekend, syncCalendar, setAvailability} from '../redux/actions';

class CalendarHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentTime: moment(new Date()).format('HH:mm . dddd'),
            currentDate: moment(new Date()).format('DD MMMM YYYY'),
            currentTimeInterval: null
        }
    }

    componentDidMount(){
        this.state.currentTimeInterval = setInterval(()=>{
            this.setState((prevState, props)=>{
                return {
                    currentDate: moment(new Date()).format('DD MMMM YYYY'),
                    currentTime: moment(new Date()).format('HH:mm . dddd')
                }
            });
        }, 60*1000);
    }

    render(){
        return (
            <div className="masthead-header">
                <div className="row">
                <div className="col-12 text-center text-white">
                    <h4 className="font-weigh-bolder time-clock mt-2">{this.state.currentTime}</h4>
                    <p className="font-weight-normal">{this.state.currentDate}</p>
                </div>
                </div>

                <div className="row align-items-center">
                <div className="col-4 text-center">
                    <div className="btn-group" role="group" aria-label="">
                    <button type="button" className="btn btn-secondary" onClick={this.props.prevWeek}>&lt;</button>
                    <button type="button" className="btn btn-secondary">{moment().startOf('year').add(this.props.currentWeek, 'week').startOf('week').format('DD MMM')} - {moment().startOf('year').add(this.props.currentWeek, 'week').endOf('week').format('DD MMM YYYY')}</button>
                    <button type="button" className="btn btn-secondary" onClick={this.props.nextWeek}>&gt;</button>
                    </div>
                </div>

                <div className="col-4 text-center">
                    <h5><span className="badge badge-primary m-2 p-2">Calendar</span></h5>
                </div>
                
                <div className="col-4 text-center">
                    <div className="btn-group" role="group" aria-label="">
                        <button type="button" className="btn btn-secondary selected">Week</button>
                        <button type="button" className="btn btn-secondary">Month</button>
                    </div>
                </div>
                </div>

                <div className="row justify-content-md-start mt-5">
                    <div className="col-md-8 offset-md-2">
                        <div style={{borderBottom: "1px solid #CCC", paddingBottom: "10px", marginBottom: "20px"}}>
                            <img src="/assets/calendar-icon.png" width="36" alt="" />
                            <span className="m-2">General Availability</span>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button type="button" className="btn btn-primary" onClick={this.props.syncCalendar}>Sync Calendar</button>
                    </div>
                </div>

                <div className="row">

                    <div className="col-md-4 offset-md-2">
                        <div className="row">
                            <div className="col">
                                <h6>Weekdays (Mon - Fri)</h6>
                                <p>Available From</p>
                            </div>
                            <div className="col text-center">
                                <input type="radio" checked="checked" className="radio-lg" /> 
                                <p>Enabled</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <TimePicker className="form-control" value={this.props.availability.weekdayAvailableFrom} name="weekdayAvailableFrom" onChange={(e)=>{this.props.setAvailability(e.target.name, e.target.value)}} />
                            </div>
                            <div className="col-auto"><span className="m-2">To</span></div>
                            <div className="col">
                                <TimePicker className="form-control" value={this.props.availability.weekdayAvailableTill} name="weekdayAvailableTill" onChange={(e)=>{this.props.setAvailability(e.target.name, e.target.value)}} />
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-4" style={{borderLeft: "1px solid #CCC"}}>
                        <div className="row">
                            <div className="col">
                                <h6>Weekend (Sat - Sun)</h6>
                                <p>Available From</p>
                            </div>
                            <div className="col text-center">
                                <input type="checkbox" className="radio-lg" onClick={this.props.toggleWeekend} /> 
                                <p>{this.props.weekendStatus ? 'Enabled' : 'Disabled'}</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <TimePicker className="form-control" value={this.props.availability.weekendAvailableFrom} name="weekendAvailableFrom" onChange={(e)=>{this.props.setAvailability(e.target.name, e.target.value)}} />
                            </div>
                            <div className="col-auto"><span className="m-2">To</span></div>
                            <div className="col">
                                <TimePicker className="form-control" value={this.props.availability.weekendAvailableTill} name="weekendAvailableTill" onChange={(e)=>{this.props.setAvailability(e.target.name, e.target.value)}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) =>{
    return {
        currentWeek: state.calendars.currentWeek,
        weekendStatus: state.calendars.weekendStatus,
        availability: state.calendars.availability
    }
}

export default connect(mapStateToProps,{prevWeek, nextWeek, toggleWeekend, syncCalendar, setAvailability})(CalendarHeader);