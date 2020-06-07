/* global gapi */
import moment from 'moment';

import {
    PREV_WEEK, 
    NEXT_WEEK, 
    TOGGLE_WEEKEND, 
    SYNC_GOOGLE_CALENDAR_REQUEST,
    SYNC_GOOGLE_CALENDAR_CLIENT_INIT_COMPLETE,
    SYNC_GOOGLE_CALENDAR_SIGNED_IN,
    SYNC_GOOGLE_CALENDAR_COMPLETE,
    SET_AVAILABILITY
} from './actionTypes';

// import {GOOGLE_API_KEY, GOOGLE_CALENDAR_CLIENT_ID, GOOGLE_CALENDAR_DISCOVERY_DOCS, GOOGLE_CALENDAR_SCOPES} from '../config';

export const prevWeek = () => ({
    type: PREV_WEEK
});

export const nextWeek = () => ({
    type: NEXT_WEEK
});

export const toggleWeekend = () => ({
    type: TOGGLE_WEEKEND
});

export const syncGoogleCalenderRequest = () => ({
    type: SYNC_GOOGLE_CALENDAR_REQUEST
});

export const syncGoogleClientInitDone = () => ({
    type: SYNC_GOOGLE_CALENDAR_CLIENT_INIT_COMPLETE
});

export const syncGoogleCalendarSignedIn = (status) => ({
    type: SYNC_GOOGLE_CALENDAR_SIGNED_IN,
    payload: status
});

export const syncGoogleCalendarComplete = (events) => ({
    type: SYNC_GOOGLE_CALENDAR_COMPLETE,
    payload: events
});

export const syncCalendar = () => {
    // console.log('in syncCalendar')
    return (dispatch, getState) => {

        let calendarReducerState = getState().calendars;
        dispatch(syncGoogleCalenderRequest());
console.log(process.env)
        let initGoogleClient = () => {
            gapi.client.init({
                apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
                clientId: process.env.REACT_APP_GOOGLE_CALENDAR_CLIENT_ID,
                discoveryDocs: [process.env.REACT_APP_GOOGLE_CALENDAR_DISCOVERY_DOCS],
                scope: process.env.REACT_APP_GOOGLE_CALENDAR_SCOPES
            }).then(()=>{
                dispatch(syncGoogleClientInitDone());
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            }, (error) => {
                alert(JSON.stringify(error));
            });
        }
    
        let updateSigninStatus = (isSignedIn) => {
            dispatch(syncGoogleCalendarSignedIn(isSignedIn));
            if(!isSignedIn) {
                signInGoogle();
            }else{
                fetchCalendarEvents(); 
            }
        }

        let signInGoogle = () => {
            gapi.auth2.getAuthInstance().signIn();
        }

        let fetchCalendarEvents = () => {
            let timeMin = moment().startOf('year').add(calendarReducerState.currentWeek, 'week').startOf('week').toISOString();
            let timeMax = moment().startOf('year').add(calendarReducerState.currentWeek, 'week').endOf('week').toISOString();
            gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': timeMin,
                'timeMax': timeMax,
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 250,
                'orderBy': 'startTime'
            }).then(function(response) {
                let events = response.result.items;
                console.log('Upcoming events:');
                let googleEvents = [];
      
                if (events.length > 0) {
                    for (let i = 0; i < events.length; i++) {
                        let event = events[i];
                        let startTime = moment(event.start.dateTime || event.start.date).toISOString();
                        let endTime = moment(event.end.dateTime || event.end.date).toISOString();
                        let summary = event.summary;
                        console.log(summary + ' (' + startTime + ')')
                        googleEvents.push({startTime, endTime, summary});
                    }
                    
                    dispatch(syncGoogleCalendarComplete(googleEvents));
                } else {
                    console.log(`No events found between ${timeMin} and ${timeMax}.`);
                }
            });
        }
        
        if(!calendarReducerState.googleCalendar.didClientInit){
            gapi.load("client", initGoogleClient);
        }else if(!calendarReducerState.googleCalendar.isSignedIn){
            signInGoogle();
        }else{
            fetchCalendarEvents();
        }
    }
}

export const setAvailability = (name, value) => ({
    type: SET_AVAILABILITY,
    payload: {
        name, value
    }  
})