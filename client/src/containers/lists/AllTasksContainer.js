import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import { AllTasks } from '../../components/lists/AllTasks';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
const axios = require('axios');
const history = createBrowserHistory();

class AllTasksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTask: '',
      taskContent: [],
      commentVal: '',
      reloadTasks: false,
      filtersAreActive: false,
      filters: {
        client: '',
        billing: '',
        user: '',
        status: '',
        project: '',
        deadline: new Date(),
        isDeadlineSet: false,
        type: ''
      },
      clientsList: [],
      billingList: [],
      usersList: [],
      projectsList: [],
      taskTypesList: [],
      tasksStatusList: [],
      currentTaskList: 'all',
      searchQuery: '',
      displaySearchInput: '',
      isLoading: true,
      redirect: false,
      costsModalOpen: false,
      costsModalType: 'task'
    };
  }

  changeFilters = (filters) => this.setState({filters: filters})
  changeFiltersAreActive = () => this.setState({filtersAreActive: !this.state.filtersAreActive})

  changeSearchQuery = e => this.setState({searchQuery: e.target.value})

  toggleSearchInput = () => {
    if(this.state.displaySearchInput === '' || this.state.displaySearchInput === 'hidesearch'){
      this.setState({displaySearchInput: 'showsearch'})
    }
    else if(this.state.displaySearchInput === 'showsearch'){
      this.setState({displaySearchInput: 'hidesearch'})
    }
  }

  changeCurrentTaskList = () => this.setState({currentTaskList: this.state.currentTaskList === 'all' ? 'self' : 'all' })

  getNumberOfActiveFilters = () => {
    var x = 0;
    if(this.state.filters.client !== '') {x++}
    if(this.state.filters.billing !== '') {x++}
    if(this.state.filters.user !== '') {x++}
    if(this.state.filters.status !== '') {x++}
    if(this.state.filters.project !== '') {x++}
    if(this.state.filters.isDeadlineSet) {x++}
    if(this.state.filters.type !== '') {x++}
    return x
  }

  getClients = () => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    axios.get(`/api/clients/basic`, { headers: { Authorization: AuthStr } }).then(res => {
      this.setState({ clientsList: res.data});
    });
  }

  getBillingModes = () => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    axios.get(`/api/misc/billing`, { headers: { Authorization: AuthStr } }).then(res => {
      this.setState({ billingList: res.data});
    });
  }

  getUsers = () => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    axios.get(`/api/users`, { headers: { Authorization: AuthStr } }).then(res => {
      this.setState({ usersList: res.data});
    });
  }

  getProjects = () =>{
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    axios.get(`/api/projects`, { headers: { Authorization: AuthStr } }).then(res => {
      this.setState({ projectsList: res.data});
    });
  }

  getTaskTypes = () => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    axios.get(`/api/misc/types`, { headers: { Authorization: AuthStr } }).then(res => {
      this.setState({ taskTypesList: res.data});
    });
  }

  getTaskStatus = () => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    axios.get(`/api/misc/status`, { headers: { Authorization: AuthStr } }).then(res => {
      this.setState({ tasksStatusList: res.data});
    });
  }

  getTaskDetails = () => {
    const {
      match: { params }
    } = this.props;
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    var idUser = JSON.parse(localStorage.getItem('user'));
    if (this.state.activeTask) {
      axios.get(`/api/tasks/content/${this.state.activeTask}`, { headers: { Authorization: AuthStr } }).then(res => {
        this.setState({ taskContent: res.data, isLoading: false }, () => this.scrollToElementD());
      });
    } else {
      if (this.props.isShare) {
        history.replace({ pathname: '/tasks' });
        axios
          .get(`/api/tasks/link/${params.id}`, { headers: { Authorization: AuthStr } })
          .then(res => {
            if (res.data === 'nodata') {
              Swal.fire({
                type: 'error',
                title: 'Tarefa inexistente'
              }).then(click => {
                this.setState({ redirect: true });
              });
            } else {
              this.setState({ activeTask: res.data.details[0].id_task });
            }
          })
          .then(res => {
            axios.get(`/api/tasks/link/${this.state.activeTask}`, { headers: { Authorization: AuthStr } }).then(res => {
              if (res.data === 'nodata') {
                this.setState({ taskContent: null, isLoading: false });
              } else {
                this.setState({ taskContent: res.data, isLoading: false }, () => this.scrollToElementD());
              }
            });
          });
      } else {
        var url = this.props.userInfo.ref_id_role === 3 || this.props.userInfo.ref_id_role === 2 ? `/api/tasks/all` : `/api/tasks/${idUser.id_user}`
        axios
          .get(url, { headers: { Authorization: AuthStr } })
          .then(res => {
            this.setState({ activeTask: res.data[0].id_task });
          })
          .then(res => {
            axios
              .get(`/api/tasks/content/${this.state.activeTask}`, { headers: { Authorization: AuthStr } })
              .then(res => {
                if (res.data === 'nodata') {
                  this.setState({ taskContent: null, isLoading: false });
                } else {
                  this.setState({ taskContent: res.data, isLoading: false});
                }
              });
          });
      }
    }
  };

  changeActiveTask = taskId => {
    if (taskId === this.state.activeTask) {
      return null;
    } else {
      this.setState({ activeTask: taskId, isLoading: true });
    }
  };

  copyAlert = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1000
    });

    Toast.fire({
      type: 'success',
      title: 'Link copiado com sucesso!'
    });
  };

  deleteActiveTask = taskId => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    Swal.fire({
      title: 'Tem a certeza?',
      text: 'Esta ação é irreversível',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        Swal.fire('Tarefa eliminada!', '', 'success').then(result => {
          if (result.value) {
            axios
              .delete(`/api/tasks/${taskId}`, { headers: { Authorization: AuthStr } })
              .then(this.setState({ activeTask: '', reloadTasks: true }));
          }
        });
      }
    });
  };

  duplicateActiveTask = taskId => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    axios.post(`/api/tasks/${taskId}`, null, { headers: { Authorization: AuthStr } })
      .then(data => {
        this.setState({ reloadTasks: true, activeTask: data.data[2].insertId});
      });
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 1000
    });

    Toast.fire({
      type: 'success',
      title: 'Tarefa duplicada com sucesso!'
    });
  };

  changeCommentVal = event => {
    if (event.keyCode === 13 && event.shiftKey === false) {
      event.preventDefault();
      this.submitComment();
    } else {
      this.setState({ commentVal: event.target.value });
    }
  };

  submitComment = () => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    var idUser = JSON.parse(localStorage.getItem('user'));
    const data = {
      text_comment: this.state.commentVal,
      id_user: idUser.id_user
    };

    axios.post(`/api/tasks/comments/${this.state.activeTask}`, data, { headers: { Authorization: AuthStr } }).then(res => {
      document.getElementById('comment-textarea').value = '';
      this.setState({ commentVal: '' });
      this.getTaskDetails();
    });
  };

  scrollToElementD = () => {
    var topPos = document.querySelector('.active').offsetTop;
    this.scrollTo(document.querySelector('.tasks-list'), topPos - 10, 600);
  };

  scrollTo = (element, to, duration) => {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;
    var that= this;
    var animateScroll = function(){        
        currentTime += increment;
        var val = that.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
  }

  //t = current time
  //b = start value
  //c = change in value
  //d = duration
  easeInOutQuad = (t, b, c, d) => {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
  };
  
  openCostsModal = (type) => {
    document.body.classList.add('costs-open', 'modal-open')
    document.getElementById('overlay').addEventListener('click', () => this.closeCostsModal())
    this.setState({costsModalOpen: true, costsModalType: type})
  }

  closeCostsModal = () => {
    document.body.classList.remove('costs-open', 'modal-open')
    document.getElementById('overlay').removeEventListener('click', () => this.closeCostsModal());
    this.setState({costsModalOpen: false})
  }


  componentDidMount() {
    this.getTaskDetails();
    this.getClients();
    this.getBillingModes();
    this.getUsers();
    this.getProjects();
    this.getTaskTypes();
    this.getTaskStatus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeTask !== this.state.activeTask) {
      this.getTaskDetails();
    }
    if (prevState.reloadTasks !== this.state.reloadTasks) {
      this.setState({ reloadTasks: false });
    }
  }

  render() {
    console.log(this.state.taskContent)
    return (
      <AllTasks
        userRole={this.props.userInfo.ref_id_role}
        taskContent={this.state.taskContent}
        isLoading={this.state.isLoading}
        activeTask={this.state.activeTask}
        changeActiveTask={this.changeActiveTask}
        deleteActiveTask={this.deleteActiveTask}
        duplicateActiveTask={this.duplicateActiveTask}
        changeCommentVal={this.changeCommentVal}
        submitComment={this.submitComment}
        isShare={this.props.isShare}
        copyAlert={this.copyAlert}
        redirect={this.state.redirect}
        activeHours={this.props.activeHours}
        getActiveHours={this.props.getActiveHours}
        activeBudgetHours={this.props.activeBudgetHours}
        getActiveBudgetHours={this.props.getActiveBudgetHours}
        reloadTasks={this.state.reloadTasks}
        filtersAreActive={this.state.filtersAreActive}
        changeFiltersAreActive={this.changeFiltersAreActive}
        filters={this.state.filters}
        changeFilters={this.changeFilters}
        getNumberOfActiveFilters={this.getNumberOfActiveFilters}
        clientsList={this.state.clientsList}
        projectsList={this.state.projectsList}
        usersList={this.state.usersList}
        billingList={this.state.billingList}
        taskTypesList={this.state.taskTypesList}
        tasksStatusList={this.state.tasksStatusList}
        currentTaskList={this.state.currentTaskList}
        changeCurrentTaskList={this.changeCurrentTaskList}
        searchQuery={this.state.searchQuery}
        changeSearchQuery={this.changeSearchQuery}
        displaySearchInput={this.state.displaySearchInput}
        toggleSearchInput={this.toggleSearchInput}
        openCostsModal={this.openCostsModal}
        closeCostsModal={this.closeCostsModal}
        isCostsModalOpen={this.state.costsModalOpen}
        costsModalType={this.state.costsModalType}
        getTaskDetails={this.getTaskDetails}
      />
    );
  }
}

export default AllTasksContainer;
