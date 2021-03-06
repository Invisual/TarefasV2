import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment'
import 'moment/locale/pt'
import 'moment-duration-format'

class ClientTasksTab extends React.Component {
  render() {
    var user = JSON.parse(localStorage.getItem('user'));
    return (
      <>
        <div className="project-task-tab">
          <div className="project-task-tab-title">
            <span className="scrum-title">Por iniciar</span>
            <div className="scrum-list">
            {this.props.clientContent.tasks.filter(status => {return status.ref_id_user_task_status === 1;}).length ?
              this.props.clientContent.tasks
              .filter(status => {
                return status.ref_id_user_task_status === 1;
              })
              .map(task => {
                return (
                  <div className="scrum-card scrum-card-clients" key={task.id_task}>
                    <div className="scrum-todo"></div>
                    {Number(user.ref_id_role) === 2 || Number(user.ref_id_role) === 3 || Number(user.id_user)===Number(task.id_user) ? 
                    <Link to={`/tasks/`+task.id_task}>
                    <div className="scrum-info">
                      <span className="scrum-task-title">{task.title_task}</span>
                      <div className="scrum-info-row"><img src={task.avatar_user} alt={task.name_user} /><span className="scrum-task-hours">{task.total_hours ? moment.duration(task.total_hours, 'hours').format('*HH[h]mm[m]', {forceLength: true}) : '00h00m'}</span><span className="scrum-task-deadline">{moment(task.deadline_date_task).format('DD MMM')}</span></div>
                    </div>
                    </Link>
                    :<div className="scrum-info">
                      <span className="scrum-task-title">{task.title_task}</span>
                      <div className="scrum-info-row"><img src={task.avatar_user} alt={task.name_user} /><span className="scrum-task-hours">{task.total_hours ? moment.duration(task.total_hours, 'hours').format('*HH[h]mm[m]', {forceLength: true}) : '00h00m'}</span><span className="scrum-task-deadline">{moment(task.deadline_date_task).format('DD MMM')}</span></div>
                      </div>
                    }
                  </div>
                );
              }) : <div>Sem tarefas por iniciar.</div>}</div>
          </div>
          <div className="project-task-tab-title">
          <span className="scrum-title">Em curso</span>
            <div className="scrum-list">
            {this.props.clientContent.tasks.filter(status => {return status.ref_id_user_task_status === 2 || status.ref_id_user_task_status===3}).length ?
              this.props.clientContent.tasks
              .filter(status => {
                return status.ref_id_user_task_status === 2 || status.ref_id_user_task_status===3
     
              })
              .map(task => {
                return (
                  <div className="scrum-card scrum-card-clients" key={task.id_task}>
                    <div className="scrum-doing"></div>
                    {Number(user.ref_id_role) === 2 || Number(user.ref_id_role) === 3 || Number(user.id_user)===Number(task.id_user) ? 
                    <Link to={`/tasks/`+task.id_task}>
                    <div className="scrum-info">
                      <span className="scrum-task-title">{task.title_task}</span>
                      <div className="scrum-info-row"><img src={task.avatar_user} alt={task.name_user} /><span className="scrum-task-hours">{task.total_hours ? moment.duration(task.total_hours, 'hours').format('*HH[h]mm[m]', {forceLength: true}) : '00h00m'}</span><span className="scrum-task-deadline">{moment(task.deadline_date_task).format('DD MMM')}</span></div>
                    </div>
                    </Link>
                    :<div className="scrum-info">
                      <span className="scrum-task-title">{task.title_task}</span>
                      <div className="scrum-info-row"><img src={task.avatar_user} alt={task.name_user} /><span className="scrum-task-hours">{task.total_hours ? moment.duration(task.total_hours, 'hours').format('*HH[h]mm[m]', {forceLength: true}) : '00h00m'}</span><span className="scrum-task-deadline">{moment(task.deadline_date_task).format('DD MMM')}</span></div>
                      </div>
                    }
                  </div>
                );
              }): <div>Sem tarefas em curso.</div>}</div>
          </div>
          <div className="project-task-tab-title">
            <span className="scrum-title">Concluídas</span>
            <div className="scrum-list">
            {this.props.clientContent.tasks.filter(status => {return status.ref_id_user_task_status === 4}).length ?
              this.props.clientContent.tasks
              .filter(status => {
                return status.ref_id_user_task_status === 4 || status.ref_id_user_task_status === 5
              })
              .map(task => {
                return (
                  <div className="scrum-card scrum-card-clients" key={task.id_task}>
                    <div className={task.ref_id_user_task_status === 4 ? 'scrum-done' : 'scrum-approval'}></div>
                    {Number(user.ref_id_role) === 2 || Number(user.ref_id_role) === 3 || Number(user.id_user)===Number(task.id_user) ? 
                    <Link to={`/tasks/`+task.id_task}>
                    <div className="scrum-info">
                      <span className="scrum-task-title">{task.title_task}</span>
                      <div className="scrum-info-row"><img src={task.avatar_user} alt={task.name_user} /><span className="scrum-task-hours">{task.total_hours ? moment.duration(task.total_hours, 'hours').format('*HH[h]mm[m]', {forceLength: true}) : '00h00m'}</span><span className="scrum-task-deadline">{moment(task.deadline_date_task).format('DD MMM')}</span></div>
                    </div>
                    </Link>
                    :<div className="scrum-info">
                      <span className="scrum-task-title">{task.title_task}</span>
                      <div className="scrum-info-row"><img src={task.avatar_user} alt={task.name_user} /><span className="scrum-task-hours">{task.total_hours ? moment.duration(task.total_hours, 'hours').format('*HH[h]mm[m]', {forceLength: true}) : '00h00m'}</span><span className="scrum-task-deadline">{moment(task.deadline_date_task).format('DD MMM')}</span></div>
                      </div>
                    }
                  </div>
                );
              }): <div>Sem tarefas concluídas.</div>}</div>
          </div>
        </div>
      </>
    );
  }
}

export default ClientTasksTab;
