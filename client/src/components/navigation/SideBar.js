import React, { Component } from 'react';
import {SidebarDiv} from '../../styles/navigation';
import { FiHome, FiFolder, FiFileText, FiCalendar, FiBookmark, FiWatch, FiEdit, FiLogOut } from 'react-icons/fi';
import { NavLink} from 'react-router-dom';

class SideBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      collapsedSidebar: false
    }
  }

  toggleSideBar = () => {
    this.setState(prevState => ({
      collapsedSidebar: !prevState.collapsedSidebar
    }))
  }

  componentDidUpdate(){
    this.state.collapsedSidebar ? document.body.classList.add('collapsed-sidebar') : document.body.classList.remove('collapsed-sidebar')
  }


  render() {

    var logoImg = this.state.collapsedSidebar ? '/img/in.png' : '/img/logo.png';
    var logoClass = this.state.collapsedSidebar ? 'logo logo-small' : 'logo logo-big';

    return (
      <SidebarDiv className="sidebar-container">
        <div className={logoClass}>
            <img alt="Invisual Branding Solutions" src={logoImg}/>
        </div>
        <div className="navigation">
            <ul>
                <NavLink exact={true} to="/" activeClassName='is-active'><li><FiHome/> <span>Dashboard</span></li></NavLink> 
                <NavLink to="/ds" activeClassName='is-active'><li><FiFolder/> <span>Projectos</span></li></NavLink> 
                <NavLink to="/admin" activeClassName='is-active'><li><FiFileText/> <span>Tarefas</span></li></NavLink>
                <NavLink to="/ds" activeClassName='is-active'><li><FiCalendar/> <span>Reuniões</span></li></NavLink>
                <NavLink to="/ds" activeClassName='is-active'><li><FiHome/> <span>Clientes</span></li></NavLink>
                <NavLink to="/ds" activeClassName='is-active'><li><FiBookmark/> <span>Objectivos</span></li></NavLink>
                <NavLink to="/ds" activeClassName='is-active'><li><FiWatch/> <span>Histórico</span></li></NavLink>  
                <NavLink to="/ds" activeClassName='is-active'><li><FiEdit/> <span>To-Do List</span></li></NavLink>
                <li onClick={this.props.logout}><FiLogOut/> <span>Log Out</span></li>
            </ul>
        </div>
        <div className="sidebar-toggle">
          <label className="switch">
              <input type="checkbox" />
              <span className="slider rounded-slider" onClick={this.toggleSideBar}></span>
          </label>
        </div>
      </SidebarDiv>
    );
  }
}

export default SideBar;
