import React, { Component } from 'react';
import { MyBudgets } from '../../components/tables/MyBudgets';
import moment from 'moment';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const axios = require('axios');

class MyBudgetsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      budgets: [],
      isLoading: true,
    };
  }

  changeBudgetStatus = (budgetId, currStatus) => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    var idUser = JSON.parse(localStorage.getItem('user'));

    var nextStatus = '';
    switch (currStatus) {
      case 1:
        nextStatus = 2;
        break;
      case 2:
        nextStatus = 3;
        break;
      case 3:
        nextStatus = 1;
        break;
      default:
        nextStatus = 1;
    }
    const data = {
      budget: budgetId,
      status: nextStatus,
      user: idUser.id_user
    };

    axios.put('/api/budgets/internalBudgetStatus', data, { headers: { Authorization: AuthStr } }).then(res => {
      this.getBudgets();
    });
  };

  getBudgets = () => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;
    var user = JSON.parse(localStorage.getItem('user'));
    var url = '/api/budgets/all'
    
    axios.get(url, { headers: { Authorization: AuthStr } }).then(res => {
      if (res.data === 'nodata') {
        this.setState({ budgets: null, isLoading: false });
      } else {
        this.setState({ budgets: res.data, isLoading: false });
      }
    });
  };

  startCountingHours = (taskId, taskTitle) => {
    if(this.props.activeHours !== undefined && this.props.activeHours !== null){
      if(this.props.activeHours.length > 0){
        Swal.fire({
          type: 'error',
          title: 'Erro!',
          text: `Já existe uma contagem de horas iniciada na Tarefa '${taskTitle}'`
        })
      }
    } 
    else{
      var token = JSON.parse(localStorage.getItem('token'));
      var AuthStr = 'Bearer ' + token;
      var user = JSON.parse(localStorage.getItem('user'));

      var data = {
        beginningHour: moment().format('H:mm:ss'),
        day: moment().format('D/MM/YYYY'),
        user: user.id_user,
        task: taskId
      }

      axios.post(`/api/hours/`, data, { headers: { Authorization: AuthStr } }).then(res => {
        this.props.getActiveHours();
        //document.title = 'Tem um registo de Horas a contar'
        const Toast = Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 2000
        });
        Toast.fire({
          type: 'success',
          title: `Contagem de Horas iniciada na Tarefa '${taskTitle}'`
        })
      });
    }
  }

  stopCountingHours = (hourId, taskTitle) => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;

    var data = {
      endingHour: moment().format('H:mm'),
      idHour: hourId
    }

    axios.put(`/api/hours/`, data, { headers: { Authorization: AuthStr } }).then(res => {
      this.props.getActiveHours();
      const Toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 2000
      });
      Toast.fire({
        type: 'error',
        title: `Contagem de Horas parada na Tarefa '${taskTitle}'`
      })
    });
  }

  componentDidMount() {
    this.getBudgets()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.reloadBudgets !== this.props.reloadBudgets) {
      this.getBudgets()
    }
  }


  render() {
    console.log(this.state.budgets)
    var filteredBudgets
    switch(this.props.type){
      case 'alltasks':
      if(this.state.budgets !== null){
        filteredBudgets = this.state.budgets.filter( task => {
          return this.props.filters.client === '' ? true : Number(task.ref_id_client) === Number(this.props.filters.client)
        }).filter(task => {
          return this.props.filters.billing === '' ? true : Number(task.ref_id_billing_mode) === Number(this.props.filters.billing)
        }).filter(task => {
          return this.props.filters.type === '' ? true : Number(task.ref_id_type_task) === Number(this.props.filters.type)
        }).filter(task => {
          return this.props.filters.user === '' ? true : Number(task.ref_id_user) === Number(this.props.filters.user)
        }).filter(task => {
          return this.props.filters.status === '' ? true : Number(task.ref_id_user_task_status) === Number(this.props.filters.status)
        }).filter(task => {
          return this.props.filters.project === '' ? true : Number(task.ref_id_project) === Number(this.props.filters.project)
        }).filter(task => {
          return this.props.filters.isDeadlineSet === false ? true : moment(task.deadline_date_task).isSameOrBefore(this.props.filters.deadline, 'day')
        })
      }
      else{
        filteredBudgets = null
      }
      
      break;

      default:
      filteredBudgets = this.state.budgets
    }

    return (
      <MyBudgets
        budget={filteredBudgets}
        title={this.props.title}
        changeBudgetStatus={this.changeBudgetStatus}
        type={this.props.type}
        isLoading={this.state.isLoading}
        changeActiveBudget={this.props.changeActiveBudget}
        activeBudget={this.props.activeBudget}
        copyAlert={this.props.copyAlert}
        startCountingHours={this.startCountingHours}
        stopCountingHours={this.stopCountingHours}
        activeHours={this.props.activeHours}
      />
    );
  }
}

export default MyBudgetsContainer;