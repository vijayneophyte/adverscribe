import React from "react";

import EventCalendar from 'react-event-calendar'
import 'style-loader!react-event-calendar/style.css';
import './styles.css'

import ReactDOM from 'react-dom';

import moment from 'moment';
import {Route, Link, Switch} from 'react-router-dom';
import {connect} from "react-redux";
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

import Time from './Time';

import {getEventData,getSelectedDateData,clearSelectedDateData,setSelectedDate} from "../actions/index";

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];

class Calendar extends React.Component {

    constructor(props) {
        super(props);
       var month =  moment().month()+1
       var year =  moment().year()
        console.log("----month,year----",month,year);
        this.props.getEventData(month,year)
        this.state = {
            moment: moment(),
            showPopover: false,
            showModal: false,
            overlayTitle: null,
            overlayContent: null,
            popoverTarget: null
        };

        this.handleNextMonth = this.handleNextMonth.bind(this);
        this.handlePreviousMonth = this.handlePreviousMonth.bind(this);
        this.handleToday = this.handleToday.bind(this);
        this.handleEventClick = this.handleEventClick.bind(this);
        this.handleEventMouseOver = this.handleEventMouseOver.bind(this);
        this.handleEventMouseOut = this.handleEventMouseOut.bind(this);
        this.handleDayClick = this.handleDayClick.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
    }

    handleNextMonth() {
        this.setState({
            moment: this.state.moment.add(1, 'M'),
        });
    }

    handlePreviousMonth() {
        this.setState({
            moment: this.state.moment.subtract(1, 'M'),
        });
    }

    handleToday() {
        this.setState({
            moment: moment(),
        });
    }

    handleEventMouseOver(target, eventData, day) {

        this.setState({
            showPopover: true,
            popoverTarget: () => ReactDOM.findDOMNode(target),
            overlayTitle: eventData.title,
            overlayContent: eventData.description,
        });
    }

    handleEventMouseOut(target, eventData, day) {
        console.log(day);
        this.setState({
            showPopover: false,
        });
    }

    handleEventClick(target, eventData, day) {
        this.setState({
            showPopover: false,
            showModal: true,
            overlayTitle: eventData.title,
            overlayContent: eventData.description,
        });
    }

    handleDayClick(target, day) {

        this.props.clearSelectedDateData();
        this.props.setSelectedDate(this.getMomentFromDay(day).format('MM/DD/YYYY'));
        this.props.getSelectedDateData(this.getMomentFromDay(day).format('MM/DD/YYYY'))
        console.log("-----slected date----",this.getMomentFromDay(day).format('MM/DD/YYYY'))
        //this.props.history.push(this.props.match.url + '/addtime');
        this.setState({
            showPopover: false,
            showModal: true,
            overlayTitle: this.getMomentFromDay(day).format('Do of MMMM YYYY'),
            overlayContent: 'User clicked day (but not event node).',
        });
    }

    getMomentFromDay(day) {
        return moment().set({
            'year': day.year,
            'month': (day.month + 0) % 12,
            'date': day.day
        });
    }

    handleModalClose() {
        this.setState({
            showModal: false,
        })
    }

    getHumanDate() {
        return [moment.months('MM', this.state.moment.month()), this.state.moment.year(),].join(' ');
    }

    render() {
        return (
            <div >
                <div className="calendar">
                    <ButtonToolbar>
                        <Button onClick={this.handlePreviousMonth}>&lt;</Button>
                        <Button onClick={this.handleNextMonth}>&gt;</Button>
                        <Button onClick={this.handleToday}>Today</Button>
                        <span className="pull-right h2">{this.getHumanDate()}</span>
                    </ButtonToolbar>
                    <EventCalendar
                        month={this.state.moment.month()}
                        year={this.state.moment.year()}
                        events={this.props.events}
                        onEventClick={this.handleEventClick}
                        onDayClick={this.handleDayClick}
                        maxEventSlots={1}
                    />
                </div>
                <div className="addtime">
                    {this.props.selectedDateData && <Time selectedDateData = {this.props.selectedDateData}/>}
                </div>

            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        events: state.Event.events,
        selectedDateData:state.Event.selectedDateData,
        selectedDate:state.Event.selectedDate

    };
};


const mapDispatchToProps = (dispatch)=> {

    return {
        getEventData: (month,year) => dispatch(getEventData(month,year)),
        getSelectedDateData: (date) => dispatch(getSelectedDateData(date)),
        clearSelectedDateData: () => dispatch(clearSelectedDateData()),
        setSelectedDate: (date) => dispatch(setSelectedDate(date)),
    };

}

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);

