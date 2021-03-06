import React from 'react';
import { Link } from 'react-router-dom';
import { AllProjectsDiv } from '../../styles/listings';
import MyProjectsContainer from '../../containers/tables/MyProjectsContainer';
import ProjectDetailContainer from '../../containers/details/ProjectDetailContainer';
import OptionsContainer from '../../containers/options/OptionsContainer';
import CostsModalContainer from '../../containers/inserts/CostsModalContainer'
import ConcludeModalContainer from '../../containers/inserts/ConcludeModalContainer'
import ProjectFilters from '../options/ProjectFilters';
import { FiFolderPlus, FiFilter, FiUserCheck, FiSearch } from 'react-icons/fi';

export const AllProjects = props => {
  return (
    <AllProjectsDiv className="dashboard-container">
      {props.projectContent ?
      <>
        <CostsModalContainer 
          closeModal={props.closeModal}
          projId={props.activeProject} 
          type={props.costsModalType} 
          costs={props.projectContent.costs}
          getProjectDetails={props.getProjectDetails}
        />
        <ConcludeModalContainer 
          closeConcludeModal={props.closeConcludeModal} 
          projId={props.activeProject}
          projectContent={props.projectContent}
          type={props.concludeModalType} 
          getProjectDetails={props.getProjectDetails}
        />
      </>
      : null}
      <div className="widgets-grid widget cards-container nofixed-height no-shadow">
        <div className="grid-widget tasks-title">
          <h4 className="widget-title">{props.concluded? 'Projetos Concluídos' : 'Projetos'}</h4>
          <div className="grid-widget left-options">
          <div className="tooltip-container projects-search">
            <input type="text" placeholder="Pesquisa" id="projects-search" className={props.displaySearchInput+ ' searchinput'} onChange={props.changeSearchQuery}/>
            <FiSearch onClick={props.toggleSearchInput}/>
            <span className="tooltip">Pesquisar Projetos</span>
          </div>
          {props.userRole === 3 || props.userRole === 2 ?
            <>
            {props.concluded? null :
            <>
              <div className="tooltip-container">
                <Link to="/createproject"><FiFolderPlus /><span className="tooltip">Adicionar Projeto</span></Link>
              </div>
              <div className={props.currentProjectList !== 'all' ? 'tooltip-container icon-tobe-selected icon-selected' : 'tooltip-container icon-tobe-selected'}>
                  <FiUserCheck className="task-view-icon" onClick={props.changeCurrentProjectList}/>
                  <span className="tooltip">{props.currentProjectList === 'all' ? 'Ver os meus Projetos' : 'Ver todos os Projetos'}</span>
              </div>
            </>
            }
            <div className={props.filtersAreActive ? 'tooltip-container filter-with-notification icon-tobe-selected icon-selected' : 'tooltip-container filter-with-notification icon-tobe-selected'}>
              {props.getNumberOfActiveFilters() > 0 ? <div className="notification"><span>{props.getNumberOfActiveFilters()}</span></div> : null}
              <FiFilter className="task-filters-icon" onClick={props.changeFiltersAreActive}/>
              <span className="tooltip">Filtrar Projetos</span>
            </div>
            </>
          : 
            <div className={props.filtersAreActive ? 'tooltip-container filter-with-notification icon-tobe-selected icon-selected' : 'tooltip-container filter-with-notification icon-tobe-selected'}>
              {props.getNumberOfActiveFilters() > 0 ? <div className="notification"><span>{props.getNumberOfActiveFilters()}</span></div> : null}
              <FiFilter className="task-filters-icon" onClick={props.changeFiltersAreActive}/>
              <span className="tooltip">Filtrar Projetos</span>
            </div>
          }
          </div>
        </div>
        <OptionsContainer
          userRole={props.userRole}
          type={'projectoptions'}
          concluded={props.concluded}
          undoActiveProject={props.undoActiveProject}
          openConcludeModal={props.openConcludeModal}
          closeConcludeModal={props.closeConcludeModal}
          activeProject={props.activeProject}
          projectContent={props.projectContent}
          isLoading={props.isLoading}
          changeFiltersAreActive={props.changeFiltersAreActive}
          filtersAreActive={props.filtersAreActive}
          deleteActiveProject={props.deleteActiveProject}
          openModal={props.openModal}
          placeholder={props.placeholder}
          duplicateActiveProject={props.duplicateActiveProject}
        />
        <div className="grid-widget tasks-list">
          <div className="tasks-list-container">
            <MyProjectsContainer
              title="Projetos"
              type="allprojects"
              concluded={props.concluded}
              changeActiveProject={props.changeActiveProject}
              filters={props.filters}
              currentProjectList={props.currentProjectList}
              activeProject={props.activeProject}
              copyAlert={props.copyAlert}
              reloadProjects={props.reloadProjects}
              searchQuery={props.searchQuery}
              placeholder={props.placeholder}
            />
          </div>
        </div>
        <div className="grid-widget tasks-detail">
        {props.filtersAreActive ?
          <ProjectFilters
            changeFilters={props.changeFilters}
            changeFiltersAreActive={props.changeFiltersAreActive}
            clientsList={props.clientsList}
            billingList={props.billingList}
            accountsList={props.accountsList}
            usersList={props.usersList}
            categoriesList={props.categoriesList}
            filters={props.filters}
            changePlaceholder={props.changePlaceholder}
          />
        :
          <ProjectDetailContainer
            activeProject={props.activeProject}
            projectContent={props.projectContent}
            changeActiveTab={props.changeActiveTab}
            activeTab={props.activeTab}
            isLoading={props.isLoading}
            changeCommentVal={props.changeCommentVal}
            submitComment={props.submitComment}
            openCostsModal={props.openCostsModal}
            openModal={props.openModal}
            placeholder={props.placeholder}
            concluded={props.concluded}
            deleteActiveTask={props.deleteActiveTask}
            duplicateActiveTask={props.duplicateActiveTask}
          />
        }
        </div>
      </div>
    </AllProjectsDiv>
  );
};

export default AllProjects;
