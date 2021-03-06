import React from 'react';
import { AllProjectsDiv } from '../../styles/listings';
import MyMeetingsContainer from '../../containers/tables/MyMeetingsContainer';
import OptionsContainer from '../../containers/options/OptionsContainer';
import MyCalendarContainer from '../../containers/tables/MyCalendarContainer';
import MeetingsOnActiveDay from '../misc/MeetingsOnActiveDay';
import { FiPlusSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const AllMeetings = props => {
  var nomeetings = [{id_meeting: 1, start: '2010-06-01', end: '2010-06-01', title: 'Boom'}]
  return (
    <AllProjectsDiv className="dashboard-container">
      <div className="widgets-grid widget cards-container nofixed-height no-shadow meetings-grid">
        <div className="grid-widget tasks-title">
          <h4 className="widget-title">Reuniões</h4>
          <div className="grid-widget left-options">
          {props.userRole === 3 || props.userRole === 2 ? (
         
            <div className="tooltip-container">
              <Link to="/createmeeting">
                <FiPlusSquare />
                <span className="tooltip">Adicionar Reunião</span>
              </Link>
            </div>
          )
            : null }
            </div>
        </div>
          <OptionsContainer
          userRole={props.userRole}
          activeProject={props.activeProject}
          projectContent={props.projectContent}
          isLoading={props.isLoading}
          deleteActiveTask={props.deleteActiveTask}
          duplicateActiveTask={props.duplicateActiveTask}
          editActiveTask={props.editActiveTask}
        />
        <div className="grid-widget tasks-list">
          <div className="tasks-list-container">
            <MyMeetingsContainer
              type="allmeetings"
              meetings={props.meetings}
              isLoading={props.isLoading}
              deleteMeeting={props.deleteMeeting}
            />
          </div>
        </div>
        <div className="grid-widget meetings-calendar">
          <MyCalendarContainer 
          type="allmeetings"
          changeActiveDay={props.changeActiveDay}
          meetings={props.meetings ? props.meetings : nomeetings}
          />
          <MeetingsOnActiveDay 
          activeDay={props.activeDay}
          meetings={props.meetings}
          isLoading={props.isLoading}
          />
        </div>
      </div>
    </AllProjectsDiv>
  );
};

export default AllMeetings;
