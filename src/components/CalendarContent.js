import React, { Component } from 'react';
import {connect} from 'react-redux';
import moment from 'moment';


class CalendarContent extends Component {
    constructor(props){
        super(props);
    }

    getDayWiseAvailability(){
        let dayWiseAvailability = [];
        for(let i=0; i<=6; i++){
            dayWiseAvailability.push([]);
        }

        for(let i=0; i<=6; i++){
            let dayAvailability = {};
            let dayStart = (i>=1 && i<=5) ? this.props.availability.weekdayAvailableFrom : this.props.availability.weekendAvailableFrom;
            let dayEnd = (i>=1 && i<=5) ? this.props.availability.weekdayAvailableTill : this.props.availability.weekendAvailableTill;
            
            dayAvailability.from = moment(dayStart, 'hh:mm a').diff(moment().startOf('day'), 'minutes');
            dayAvailability.till = moment(dayEnd, 'hh:mm a').diff(moment().startOf('day'), 'minutes');
            dayAvailability.type = 'normal';
            dayWiseAvailability[i].push(dayAvailability);
        }
        // console.log(dayWiseAvailability);
        return dayWiseAvailability;
    }

    getDayWiseGoogleEvents(){
        let dayWiseGoogleEvents = [];
        for(let i=0; i<=6; i++){
            dayWiseGoogleEvents.push([]);
        }

        for(let i=0; i<this.props.googleCalendar.events.length; i++){
            let event = this.props.googleCalendar.events[i];
            let startMoment = moment(event.startTime);
            let endMoment = moment(event.endTime);

            let midNighMoment = moment(startMoment).startOf('day');
            let weekDayNum = startMoment.day();

            let from = startMoment.diff(midNighMoment, 'minutes');
            let till = endMoment.diff(midNighMoment, 'minutes');
            let type = 'google';
            let summary = event.summary;
            dayWiseGoogleEvents[weekDayNum].push({from, till, type, summary});
        }
        return dayWiseGoogleEvents;
    }

    mergeIntervals(normal, google){
        let merged = JSON.parse(JSON.stringify(normal));
        let mI = 0;
        // console.log(normal, google)
        for(let gI=0; gI<google.length; gI++){
            let ge = google[gI];
            let me = merged[mI];
            if(ge.from >= me.from && ge.till <= me.till){
                merged[mI].till = ge.from;
                merged.push(ge);
                merged.push({from: ge.till, till: normal[0].till, type: normal[0].type});
                mI += 2;
            }
        }

        // console.log(merged);
        return merged;
    }

    getDayWiseEvents(){

        let dayWiseAvailability = this.getDayWiseAvailability();
        let dayWiseGoogleEvents = this.getDayWiseGoogleEvents();
        // console.log(dayWiseAvailability);
        // console.log(dayWiseGoogleEvents);

        let daysEvents = [];
        for(let i=0; i<=6; i++){
            daysEvents.push([]);
        }
        
        for(let i=0; i<=6; i++){

            let mergedEvents = this.mergeIntervals(dayWiseAvailability[i], dayWiseGoogleEvents[i]);
            mergedEvents.forEach(evt=>{
                daysEvents[i].push(<div className={evt.type+'-event'} style={{
                            left:0, 
                            height:(evt.till-evt.from)+'px',
                            top: evt.from+'px'
                        }}>
                        <span className="badge event-time">{moment().startOf('day').add(evt.from, 'minutes').format('hh:mm a')} - {moment().startOf('day').add(evt.till, 'minutes').format('hh:mm a')}</span>
                        <span className="badge google-event-summary" style={{height:(evt.till-evt.from)+'px'}}>{evt.type=='normal'? 'Available to Book' :evt.summary}</span>
                </div>)
            })
        }

        return daysEvents;
        /* for(let i=0; i<this.state.googleEvents.length; i++){
            let event = this.state.googleEvents[i];
            let startMoment = moment(event.startTime);
            let endMoment = moment(event.endTime);

            let midNighMoment = moment(startMoment).startOf('day');
            let weekDayNum = startMoment.day();

            let minsFromMidNightStart = startMoment.diff(midNighMoment, 'minutes');
            let minsFromMidNightEnd = endMoment.diff(midNighMoment, 'minutes');

            // console.log(minsFromMidNightStart, minsFromMidNightEnd, startMoment, endMoment, midNighMoment);
            if(minsFromMidNightStart>=0 && minsFromMidNightEnd<=1440){
                daysEvents[weekDayNum].push(<div className="google-event" style={{
                                    left:0, 
                                    height:(minsFromMidNightEnd-minsFromMidNightStart)+'px',
                                    top: minsFromMidNightStart+'px'
                                }}>
                                <span className="badge google-event-time">{startMoment.format('h:mm a')} - {endMoment.format('h:mm a')}</span>
                                <span className="badge google-event-summary" style={{height:(minsFromMidNightEnd-minsFromMidNightStart)+'px'}}>{event.summary}</span>
                        </div>)
            }
        }*/

        // console.log(dayWiseEvents);
        // return daysEvents;
    }

    render() {
        let startWeek = this.props.weekendStatus ? 0 : 1;
        let endWeek = this.props.weekendStatus ? 6 : 5;

        let rowHeaders = [];
        for(let i=startWeek; i<=endWeek; i++){
            rowHeaders.push(<div className="col"><span className="badge m-2 p-2">{moment().startOf('week').add(i, 'days').format('DD/MM ddd')}</span></div>);
        }

        let colHeaders = [];
        for(let i=0; i<24; i++){
            colHeaders.push(<span className="badge div-calendar-col-header">{moment().startOf('day').add(i, 'hour').format('hha')}</span>);
        }

        let dayWiseEvents = this.getDayWiseEvents();
        let cols = [];
        for(let i=startWeek; i<=endWeek; i++){
            cols.push(<div role="gridcell" className="col div-calendar-cols">{dayWiseEvents[i]}</div>)
        }
        // let cols = dayWiseEvents.map(events=>{
        //     return <div role="gridcell" className="col div-calendar-cols">{events}</div>
        // });

        return (
            <div className="calendar">
                <div className="row text-center pb-3 pt-5">
                    <div className="col"><span className="badge badge-secondary m-2 p-2">GMT {moment(new Date()).format('Z')}</span></div>
                    {rowHeaders}
                </div>
                <div className="row text-center">
                    <div aria-hidden="true" className="div-calendar-hidden-area">
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                        <div className="div-calendar-hidden-rows"></div>
                    </div>
                    <div role="gridcell" className="col div-calendar-cols">{colHeaders}</div>
                    {cols}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        weekendStatus: state.calendars.weekendStatus,
        googleCalendar: state.calendars.googleCalendar,
        availability: state.calendars.availability
    }
}

export default connect(mapStateToProps)(CalendarContent);