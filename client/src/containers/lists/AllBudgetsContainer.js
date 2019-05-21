import React, { Component } from 'react';
import { createBrowserHistory } from 'history';
import { AllBudgets } from '../../components/lists/AllBudgets';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';
const axios = require('axios');
const history = createBrowserHistory();

class AllBudgetsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeBudget: '',
      budgetContent: [],
      commentVal: '',
      reloadBudgets: false,
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
      isLoading: true,
      redirect: false
    };
  }

  changeFilters = (filters) => this.setState({filters: filters})
  changeFiltersAreActive = () => this.setState({filtersAreActive: !this.state.filtersAreActive})

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

  getBudgetDetails = () => {
    const {
      match: { params }
    } = this.props;
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    var idUser = JSON.parse(localStorage.getItem('user'));
    if (this.state.activeBudget) {
      axios.get(`/api/budgets/content/${this.state.activeBudget}`, { headers: { Authorization: AuthStr } }).then(res => {
        this.setState({ budgetContent: res.data, isLoading: false }/*, () => this.scrollToElementD()*/);
      });
    } else {
      if (this.props.isShare) {
        history.replace({ pathname: '/budgets' });
        axios
          .get(`/api/budgets/link/${params.id}`, { headers: { Authorization: AuthStr } })
          .then(res => {
            if (res.data === 'nodata') {
              Swal.fire({
                type: 'error',
                title: 'Orçamento inexistente'
              }).then(click => {
                this.setState({ redirect: true });
              });
            } else {
              this.setState({ activeBudget: res.data.details[0].id_budget });
            }
          })
          .then(res => {
            axios.get(`/api/budgets/link/${this.state.activeBudget}`, { headers: { Authorization: AuthStr } }).then(res => {
              if (res.data === 'nodata') {
                this.setState({ budgetContent: null, isLoading: false });
              } else {
                this.setState({ budgetContent: res.data, isLoading: false }/*, () => this.scrollToElementD()*/);
              }
            });
          });
      } else {
        var url = `/api/budgets/all`
        axios
          .get(url, { headers: { Authorization: AuthStr } })
          .then(res => {
            this.setState({ activeBudget: res.data[0].id_budget });
          })
          .then(res => {
            axios
              .get(`/api/budget/content/${this.state.activeBudget}`, { headers: { Authorization: AuthStr } })
              .then(res => {
                if (res.data === 'nodata') {
                  this.setState({ budgetContent: null, isLoading: false });
                } else {
                  this.setState({ budgetContent: res.data, isLoading: false});
                }
              });
          });
      }
    }
  };

  changeActiveBudget = budgetId => {
    if (budgetId === this.state.activeBudget) {
      return null;
    } else {
      this.setState({ activeBudget: budgetId, isLoading: true });
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

  deleteActiveBudget = budgetId => {
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
              .delete(`/api/budget/${budgetId}`, { headers: { Authorization: AuthStr } })
              .then(this.setState({ activeBudget: '', reloadTasks: true }));
          }
        });
      }
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

    axios.post(`/api/budgets/comments/${this.state.activeBudget}`, data, { headers: { Authorization: AuthStr } }).then(res => {
      document.getElementById('comment-textarea').value = '';
      this.setState({ commentVal: '' });
      this.getBudgetDetails();
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
  

  componentDidMount() {
    this.getBudgetDetails();
    this.getClients();
    this.getBillingModes();
    this.getUsers();
    this.getProjects();
    this.getTaskTypes();
    this.getTaskStatus();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeBudget !== this.state.activeBudget) {
      this.getBudgetDetails();
    }
    if (prevState.reloadBudgets !== this.state.reloadBudgets) {
      this.setState({ reloadTasks: false });
    }
  }

  render() {
    return (
      <AllBudgets
        userRole={this.props.userInfo.ref_id_role}
        budgetContent={this.state.budgetContent}
        isLoading={this.state.isLoading}
        activeBudget={this.state.activeBudget}
        changeActiveBudget={this.changeActiveBudget}
        deleteActiveBudget={this.deleteActiveBudget}
        changeCommentVal={this.changeCommentVal}
        submitComment={this.submitComment}
        isShare={this.props.isShare}
        copyAlert={this.copyAlert}
        redirect={this.state.redirect}
        activeHours={this.props.activeHours}
        getActiveHours={this.props.getActiveHours}
        reloadBudgets={this.state.reloadBudgets}
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
      />
    );
  }
}

export default AllBudgetsContainer;