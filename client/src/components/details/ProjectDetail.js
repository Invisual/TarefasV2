import React from 'react';
import { ProjectDetailsDiv } from '../../styles/listings';
import ProjectReviewTab from '../../components/tabs/ProjectReviewTab';
import ProjectTasksTab from '../../components/tabs/ProjectTasksTab';
import ProjectCommentsTab from '../../components/tabs/ProjectCommentsTab';
import moment from 'moment';
import 'moment/locale/pt';
import 'moment-duration-format';
import { FiClock, FiUser, FiSend, FiFolder, FiCreditCard } from 'react-icons/fi';

export const ProjectDetail = props => {
  return (
    <>
      {props.isLoading ? (
        <ProjectDetailsDiv>
          <img src="/img/loading.svg" alt="loading" className="loading-spinner" />
        </ProjectDetailsDiv>
      ) : props.projectContent ? 
          props.placeholder ?
          <div className="no-content"></div>
          :(
        <ProjectDetailsDiv>
          <div className="project-details-grid">
            <div className="grid-item">
              <div className="project-icon">
                <FiFolder />
              </div>
            </div>

            <div className="grid-item">
              <div className="project-header">
                <h4 className="project-title">{props.projectContent.details[0].title_project}</h4>
                <div className="project-date">
                  <FiClock /> <span>{moment(props.projectContent.details[0].deadline_project).format('D/MM/YYYY')}</span>{' '}
                  <span>
                    <FiUser className="project-date" />{' '}
                    <span className="name-client">{props.projectContent.details[0].name_client}</span>
                  </span>
                    <FiCreditCard className="project-date" />{' '}
                    <span>{props.projectContent.details[0].name_billing_mode}</span>
                </div>
                <div className="project-infos">
                  <div
                    className={'project-tab ' + (props.activeTab === 'projectreview' ? 'active-tab' : '')}
                    onClick={() => props.changeActiveTab('projectreview')}
                  >
                    Project Review
                  </div>
                  <div
                    className={'project-tab ' + (props.activeTab === 'projecttasks' ? 'active-tab' : '')}
                    onClick={() => props.changeActiveTab('projecttasks')}
                  >
                    Tarefas
                  </div>
                  <div
                    className={'project-tab ' + (props.activeTab === 'projectcomments' ? 'active-tab' : '')}
                    onClick={() => props.changeActiveTab('projectcomments')}
                  >
                    Comentários ({props.projectContent.details[0].total_comments})
                  </div>
                </div>
              </div>
              {(() => {
                switch (props.activeTab) {
                  case 'projectreview':
                    return <ProjectReviewTab projectContent={props.projectContent} openCostsModal={props.openCostsModal} openModal={props.openModal} type={props.type} concluded={props.concluded}/>;
                  case 'projecttasks':
                    return <ProjectTasksTab projectContent={props.projectContent} deleteActiveTask={props.deleteActiveTask} duplicateActiveTask={props.duplicateActiveTask} />;
                  case 'projectcomments':
                    return <ProjectCommentsTab projectContent={props.projectContent} />;
                  default:
                    return <ProjectReviewTab projectContent={props.projectContent} openCostsModal={props.openCostsModal} openModal={props.openModal} type={props.type} concluded={props.concluded}/>;
                }
              })()}
            </div>
          </div>
          {props.activeTab === 'projectcomments' ? (
            <div className="project-add-comment">
              <div />
              <div className="comment-input">
                <textarea
                  placeholder="Escreve um comentário..."
                  id="comment-textarea"
                  onChange={props.changeCommentVal}
                  onKeyDown={props.changeCommentVal}
                />
              </div>
              <div className="comment-submit" onClick={props.submitComment}>
                <FiSend />
              </div>
            </div>
          ) : null}
        </ProjectDetailsDiv>
      ) : (
          <div className="no-content"></div>
      )}
    </>
  );
};

export default ProjectDetail;
