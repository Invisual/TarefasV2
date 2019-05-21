import React, { Component } from 'react';
import SideBar from './components/navigation/SideBar';
import TopBarContainer from './containers/navigation/TopBarContainer';
import UserDashboardContainer from './containers/dashboard/UserDashboardContainer';
import AdminDashboardContainer from './containers/dashboard/AdminDashboardContainer';
import LoginContainer from './containers/auth/LoginContainer';
import ResetPasswordContainer from './containers/auth/ResetPasswordContainer';
import AllTasksContainer from './containers/lists/AllTasksContainer';
import AllProjectsContainer from './containers/lists/AllProjectsContainer';
import AllMeetingsContainer from './containers/lists/AllMeetingsContainer';
import AllClientsContainer from './containers/lists/AllClientsContainer';
import AllTeamContainer from './containers/lists/AllTeamContainer';
import GantTasksContainer from './containers/lists/GantTasksContainer';
import MyToDoContainer from './containers/tables/MyToDoContainer';
import CreateProjectContainer from './containers/inserts/CreateProjectContainer';
import CreateTaskContainer from './containers/inserts/CreateTaskContainer';
import CreateMeetingContainer from './containers/inserts/CreateMeetingContainer';
import CreateClientContainer from './containers/inserts/CreateClientContainer';
import CreateClientInfoContainer from './containers/inserts/CreateClientInfoContainer';
import './styles/main.css';
import { Switch, Route } from 'react-router-dom';
import moment from 'moment'
import 'moment/locale/ru';
import ChatTaskContainer from './containers/chat/ChatTaskContainer';

moment.locale('pt')

class App extends Component {
  render() {
    return (
      <>
        {this.props.loggedIn ? (
          <div className="app-container">
            <TopBarContainer canGoBack={this.props.canGoBack} userInfo={this.props.userInfo} />
            <SideBar logout={this.props.logout} />
            <Switch>
              <Route exact path="/" render={props => <><UserDashboardContainer activeHours={this.props.activeHours} getActiveHours={this.props.getActiveHours} {...props} /><MyToDoContainer {...props} title="To-do List" type="complete"/></>} />
              <Route exact path="/tasks" render={props => <AllTasksContainer isShare={false} userInfo={this.props.userInfo} {...props} activeHours={this.props.activeHours} getActiveHours={this.props.getActiveHours}/>} />
              <Route exact path="/tasks/:id" render={props => <AllTasksContainer isShare={true} userInfo={this.props.userInfo} {...props}  activeHours={this.props.activeHours} getActiveHours={this.props.getActiveHours}/>} />
              <Route exact path="/projects" render={props => <AllProjectsContainer isShare={false} userInfo={this.props.userInfo} {...props} />} />
              <Route exact path="/projects/:id" render={props => <AllProjectsContainer isShare={true} userInfo={this.props.userInfo} {...props} />} />
              <Route exact path="/meetings" render={props => <AllMeetingsContainer userInfo={this.props.userInfo} {...props} />} />
              <Route exact path="/clients" render={props => <AllClientsContainer isShare={false} userInfo={this.props.userInfo} {...props} />} />
              <Route exact path="/clients/:id" render={props => <AllClientsContainer isShare={true} userInfo={this.props.userInfo} {...props} />} />
              <Route path="/admin" render={props => <GantTasksContainer {...props} />} />
              <Route exact path="/team" render={props => <AllTeamContainer userInfo={this.props.userInfo} {...props} />} />
              <Route exact path="/gant" render={props => <GantTasksContainer userInfo={this.props.userInfo} {...props} />} />
              <Route exact path="/chat" render={props => <ChatTaskContainer userInfo={this.props.userInfo} {...props} />} />
              <Route exact path="/createproject" render={props => <CreateProjectContainer {...props} type="add" title="Novo Projeto"/>} />
              <Route path="/createproject/:id" render={props => <CreateProjectContainer {...props} type="edit" title="Editar Projeto"/>} />
              <Route exact path="/createtask" render={props => <CreateTaskContainer {...props} type="add" title="Nova Tarefa"/>} />
              <Route path="/createtask/:id" render={props => <CreateTaskContainer {...props} type="edit" title="Editar Tarefa"/>} />
              <Route exact path="/createmeeting" render={props => <CreateMeetingContainer {...props} type="add" title="Nova Reunião"/>} />
              <Route path="/createmeeting/:id" render={props => <CreateMeetingContainer {...props} type="edit" title="Editar Reunião"/>} />
              <Route exact path="/createclient" render={props => <CreateClientContainer {...props} type="add" title="Novo Cliente"/>} />
              <Route path="/createclient/:id" render={props => <CreateClientContainer {...props} type="edit" title="Editar Cliente"/>} />
              <Route path="/createclientinfo/:id" render={props => <CreateClientInfoContainer {...props} type="edit" title="Editar Infos do Cliente "/>} />
            </Switch>
          </div>
        ) : (
          <div className="app-container">
          <Switch>
            
            <Route exact path="/respasstar/:user/:randomstring" render={props => <ResetPasswordContainer {...props} />} />
            <Route path="/" render={props => <LoginContainer {...props} login={this.props.login} />} />
          </Switch>
          </div>
        )}
        </>
    );
  }
}

export default App;
