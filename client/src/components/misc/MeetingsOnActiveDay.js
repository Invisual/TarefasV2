import React, {Component} from 'react';
import SingleMeeting from '../singles/SingleMeeting';
import moment from 'moment'

class MeetingsOnActiveDay extends Component{
    render(){
        var activeDayMeetings = this.props.meetings ? this.props.meetings.filter(meeting => {
           return meeting.start.substring(0,10) === this.props.activeDay
        }) : this.props.meetings
        return (
                <div className="active-day-meetings-container">
                    <div className="day">
                        <h5>{moment(this.props.activeDay).format('D MMM YYYY')}</h5>
                        <span>{moment(this.props.activeDay).format('dddd')}</span>
                    </div>
                    <div className="meetings">
                        {activeDayMeetings ?
                            activeDayMeetings.map(meeting => {
                                return (
                                    <SingleMeeting
                                    key={meeting.id_meeting}
                                    id={meeting.id_meeting}
                                    title={meeting.title}
                                    client={meeting.name_client}
                                    place={meeting.place_meeting}
                                    meetingType={meeting.type_meeting}
                                    date={meeting.start}
                                    startHour={meeting.start_hour_meeting}
                                    endHour={meeting.end_hour_meeting}
                                    intervenientes={meeting.intervenientes}
                                    type="small"
                                    />
                                );
                            })
                        :
                            <div className="placeholder">Não existem Reuniões neste dia.</div>
                        }
                    </div>
                </div>
        );
    }
}

export default MeetingsOnActiveDay;