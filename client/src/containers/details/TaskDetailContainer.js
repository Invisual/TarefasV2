import React, { Component } from 'react';
import { TaskDetail } from '../../components/details/TaskDetail';

class TaskDetailContainer extends Component {
  render() {
    return (
      <TaskDetail
        taskContent={this.props.taskContent}
        activeTask={this.props.activeTask}
        isLoading={this.props.isLoading}
        changeCommentVal={this.props.changeCommentVal}
        submitComment={this.props.submitComment}
        openCostsModal={this.props.openCostsModal}
        openModal={this.props.openModal}
        type={this.props.type}
        placeholder={this.props.placeholder}
        concluded={this.props.concluded}
      />
    );
  }
}

export default TaskDetailContainer;
