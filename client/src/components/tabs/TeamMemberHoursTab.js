import React, {Component} from 'react'
import { FiTrash2, FiEdit2 } from 'react-icons/fi';
import moment from 'moment'
import DatePicker from 'react-date-picker'
import { FiCalendar } from 'react-icons/fi';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

const axios = require('axios')


class TeamMemberHoursTab extends Component {
    constructor(props){
        super(props)
        this.state = {
            taskHours: [],
            date: moment(new Date()).subtract(1, 'days').format('YYYY-MM-D'),
            isLoading: true
        }
    }

    changeDate = val => this.setState({date: moment(val).format('YYYY-MM-D')})

    getTaskHours = () => {
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token
        axios.get(`/api/hours/${this.props.activeMember}/${this.state.date}`, { headers: { Authorization: AuthStr } })
        .then(res => {
            if (res.data === 'nodata') {
                this.setState({ taskHours: null, isLoading: false });
            } else {
                this.setState({ taskHours: res.data, isLoading: false });
            }
        })
    }

    deleteTaskHour = hourId => {
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token;
        Swal.fire({
          title: 'Tem a certeza que quer eliminar este registo de Horas?',
          text: 'Esta ação é irreversível',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sim, eliminar!',
          cancelButtonText: 'Cancelar'
        }).then(result => {
          if (result.value) {
            Swal.fire('Registo de Horas Eliminado', '', 'success').then(result => {
              if (result.value) {
                axios.delete(`/api/hours/${hourId}`, { headers: { Authorization: AuthStr } })
                .then(res => this.getTaskHours())
              }
            });
          }
        });
    }

    componentDidMount(){
        this.getTaskHours()
        if(moment().isoWeekday() === 1){
            this.setState({date: moment(new Date()).subtract(3, 'days').format('YYYY-MM-D')})
        }
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.date !== this.state.date){
            this.getTaskHours()
        }
    }

    render(){
        var user = JSON.parse(localStorage.getItem('user'));
        return (
            <div className="user-hours-content">
                <div className="user-hours-date">
                    <DatePicker onChange={this.changeDate} format="y-MM-dd" locale="pt-PT" value={new Date(this.state.date)} calendarIcon={<FiCalendar/>}/>
                </div>
                {this.state.isLoading ? 
                    <img src="/img/loading.svg" alt="loading" className="loading-spinner" />
                :
                    <div>
                    <h2>Horas no dia {moment(this.state.date).format('DD MMMM')}</h2>
                    {this.state.taskHours ?
                        <div className="user-hours-list">
                            {this.state.taskHours.map(hour => {
                                return (
                                    <div className="single-user-hour single-card" key={hour.id_task_hour}>
                                        <p className="hour-day">{moment(hour.day).format('D MMM')}</p>
                                        <p className="hour-task-title">{hour.title_task}</p>
                                        <p className="hour-task-time">{moment(hour.beginning_hour, 'HHmm').format('HH:mm')}h - {moment(hour.ending_hour, 'HHmm').format('HH:mm')}h</p>
                                        <p className="hour-task-time">{moment(hour.difference, 'HHmm').format('HH:mm')}</p>
                                        {Number(user.ref_id_role) === 2 || Number(user.ref_id_role) === 3 ?
                                            <div className="hour-actions">
                                                <FiEdit2 onClick={() => {this.props.changeEditHourId(hour.id_task_hour); this.props.openModal('hours')}}/>
                                                <FiTrash2 onClick={() => this.deleteTaskHour(hour.id_task_hour)}/>
                                            </div>
                                        :
                                            null
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    :
                        <div className="no-hours no-content">
                            <div className="empty-placeholder">Este utilizador não tem registo de Horas neste dia.</div>
                        </div>
                    }
                    </div>
                }
            </div>
        )
    }
}

export default TeamMemberHoursTab