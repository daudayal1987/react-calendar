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
} from './../actionTypes';


const initialState = {
    currentWeek: moment().week() - 1,
    weekendStatus: false,
    googleCalendar:{
        didClientInit: false,
        isLoading: false,
        isSignedIn: false,
        events: []
    },
    availability: {
        weekdayAvailableFrom: '09:30AM',
        weekdayAvailableTill: '07:30PM',
        weekendAvailableFrom: '11:30AM',
        weekendAvailableTill: '05:30PM'
    }
}

export default function(state = initialState, action){
    console.log(state, action);
    switch(action.type){
        case PREV_WEEK:
            return {
                ...state,
                currentWeek: state.currentWeek - 1,
                googleCalendar: {
                    ...state.googleCalendar,
                    events: []
                }
            };
        case NEXT_WEEK:
            return {
                ...state,
                currentWeek: state.currentWeek + 1,
                googleCalendar: {
                    ...state.googleCalendar,
                    events: []
                }
            };
        case TOGGLE_WEEKEND:
            return {
                ...state,
                weekendStatus: !state.weekendStatus
            };
        case SYNC_GOOGLE_CALENDAR_REQUEST:
            return {
                ...state,
                googleCalendar: {
                    ...state.googleCalendar,
                    isLoading: true,
                    events: []
                }
            };
        case SYNC_GOOGLE_CALENDAR_CLIENT_INIT_COMPLETE:
            return {
                ...state,
                googleCalendar: {
                    ...state.googleCalendar,
                    didClientInit: true
                }
            };
        case SYNC_GOOGLE_CALENDAR_SIGNED_IN:
            return {
                ...state,
                googleCalendar: {
                    ...state.googleCalendar,
                    isSignedIn: action.payload
                }
            };
        case SYNC_GOOGLE_CALENDAR_COMPLETE:
            return {
                ...state,
                googleCalendar: {
                    ...state.googleCalendar,
                    events: action.payload
                }
            };
        case SET_AVAILABILITY:
            return {
                ...state,
                availability:{
                    ...state.availability,
                    [action.payload.name]: action.payload.value
                }
            }
        default:
            return state;
    }
}