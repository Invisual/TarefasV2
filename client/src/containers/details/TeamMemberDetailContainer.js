import React, { Component } from 'react';
import { TeamMemberDetail } from '../../components/details/TeamMemberDetail';

class TeamMemberDetailContainer extends Component {
  render() {
    return (
      <TeamMemberDetail
        activeMember={this.props.activeMember}
        memberContent={this.props.memberContent}
        changeActiveTab={this.props.changeActiveTab}
        activeTab={this.props.activeTab}
        isLoading={this.props.isLoading}
        filters={this.props.filters}
        openModal={this.props.openModal}
        changeEditHourId={this.props.changeEditHourId}
        userInfo={this.props.userInfo}
      />
    );
  }
}

export default TeamMemberDetailContainer;
