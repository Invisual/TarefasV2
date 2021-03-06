import React, {Component} from 'react';
import {CreateTask} from '../../components/inserts/CreateTask';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'
import moment from 'moment'

const axios = require('axios');

class CreateTaskContainer extends Component{
    constructor(props){
        super(props);
        this.state = {
            typeInput: '1',
            titleInput: '',
            clientInput: '',
            nameInput: '',
            descInput: '',
            projectInput: '',
            deadlineInput: new Date(),
            startDateInput: new Date(),
            accountInput: '',
            personInput: '',
            billingInput: '',
            extraInputs: [],
            numberOfExtraInputs: 0,
            typesData: [],
            clientsData: [],
            billingData: [],
            accountsData: [],
            usersData: [],
            projectsData: [],
            taskData: [],
            redirect: false,
            isLoading: true,
            error: false,
            errorMsg: '',
            lastInsertedId:''
        }
    }

    changeTypeInput = e => this.setState({ typeInput: e.target.value })

    changeTitleInput = (e) => {
        this.setState({ titleInput: e.target.value })
    }

    changeClientInput = (e) => {
        this.setState({ clientInput: e.target.value })
    }

    changeNameInput = (e) => {
        this.setState({ nameInput: e.target.value })
    }

    changeDescInput = (e) => {
        this.setState({ descInput: e.target.value })
    }

    changeProjectInput = (e) => {
        this.setState({ projectInput: e.target.value })
    }

    changeDeadlineInput = (val) => {
        this.setState({ deadlineInput: val })
    }

    changeStartDateInput = (val) => {
        this.setState({ startDateInput: val }, () => {
            if (moment(this.state.deadlineInput).isBefore(moment(this.state.startDateInput), 'day')) {
                this.setState({ deadlineInput:  moment(this.state.startDateInput).add(1, 'day')})
            }
        });
    }

    changeAccountInput = (e) => {
        this.setState({ accountInput: e.target.value })
    }

    changePersonInput = (e) => {
        this.setState({ personInput: e.target.value })
    }

    changeBillingInput = (e) => {
        this.setState({ billingInput: e.target.value })
    }

    changeExtraInputs = (e) => {
        this.setState({ extraInputs: [...this.state.extraInputs, e.target.value] })
    }

    increaseNumberOfExtraInputs = () => {
        this.setState({numberOfExtraInputs: this.state.numberOfExtraInputs+1})
    }

    decreaseNumberOfExtraInputs = () => {
        this.setState({numberOfExtraInputs: this.state.numberOfExtraInputs-1})
    }

    getTypesData = () => {
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token;
        axios.get('/api/misc/types', { headers: { Authorization: AuthStr } })
        .then(res => {
            this.setState({typesData: res.data})
        })
    }

    getClientsData = () => {
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token;
        axios.get('/api/clients/basic', { headers: { Authorization: AuthStr } })
        .then(res => {
            this.setState({clientsData: res.data})
        })
    }

    getBillingData = () => {
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token;
        axios.get('/api/misc/billing', { headers: { Authorization: AuthStr } })
        .then(res => {
            this.setState({billingData: res.data})
        })
    }

    getAccountsData = () => {
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token;
        axios.get('/api/users/accounts', { headers: { Authorization: AuthStr } })
        .then(res => {
            this.setState({accountsData: res.data})
        })
    }

    getProjectsData = () => {
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token;
        axios.get('/api/projects/basic', { headers: { Authorization: AuthStr } })
        .then(res => {
            this.setState({projectsData: res.data}, () => {
                if(this.props.hasProject){
                    var projectId = this.props.match.params.project;
                    var clientId = this.state.projectsData.filter(proj => Number(proj.id_project) === Number(projectId))[0].ref_id_client
                    this.setState({clientInput: clientId, projectInput: projectId})
                }
            })
        })
    }

    getUsersData = () => {
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token;
        axios.get('/api/users/', { headers: { Authorization: AuthStr } })
        .then(res => {
            this.setState({usersData: res.data})
        })
    }

    getTaskData = () => {
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token;
        var id = this.props.match.params.id;
        axios.get(`/api/tasks/basic/${id}`, { headers: { Authorization: AuthStr } })
        .then(res => {
            if(res.data === 'notask'){
                Swal.fire({
                    type: 'error',
                    title: 'ID não existente',
                    text: `A Tarefa que está a tentar editar não existe.`
                  })
                  .then(click => {
                      this.setState({redirect: true})
                  })
            }
            else{
                this.setState({
                    taskData: res.data[0],
                    typeInput: res.data[0].ref_id_type_task,
                    titleInput:res.data[0].title_task,
                    clientInput:res.data[0].ref_id_client,
                    descInput:res.data[0].description_task,
                    projectInput:res.data[0].ref_id_project,
                    deadlineInput:res.data[0].deadline_date_task,
                    startDateInput:res.data[0].starting_date_task,
                    accountInput:res.data[0].ref_id_user_account,
                    personInput: res.data[0].ref_id_user,
                    billingInput: res.data[0].ref_id_billing_mode
                })
            }
        })
    }

    insertTask = (e) => {
        e.preventDefault();
        var clientName =  this.state.clientsData.filter(client => Number(client.id_client) === Number(this.state.clientInput))[0].name_client
        let accountName;
        let userSlack;
        let userName;
        if(this.state.typeInput !== '1'){
            accountName =  this.state.usersData.filter(user => Number(user.id_user) === Number(this.state.accountInput))[0].name_user
        }
        else{
            accountName = ''
        }

        if(this.state.typeInput !== '3'){
            userSlack =  this.state.usersData.filter(user => Number(user.id_user) === Number(this.state.personInput))[0].slack_id_user
            userName =  this.state.usersData.filter(user => Number(user.id_user) === Number(this.state.personInput))[0].name_user
        }
        else{
            userSlack =  this.state.usersData.filter(user => Number(user.id_user) === Number(this.state.accountInput))[0].slack_id_user
            userName =  this.state.usersData.filter(user => Number(user.id_user) === Number(this.state.accountInput))[0].name_user
        }

        var extraInputs = []
        for(var i=0, count=this.state.numberOfExtraInputs; i<count; i++){
            let title = document.getElementById(`extra-name-input-${i}`).value
            let userId = document.getElementById(`extra-person-input-${i}`).value
            let userName = this.state.usersData.filter(user => Number(user.id_user) === Number(userId))[0].name_user
            let userSlack = this.state.usersData.filter(user => Number(user.id_user) === Number(userId))[0].slack_id_user
            var newObj = {
                title: title,
                user: userId,
                userName: userName,
                userSlack: userSlack
            }
            extraInputs.push(newObj)
        }
        var data = {
            title: this.state.titleInput,
            description: this.state.descInput,
            deadline: moment(this.state.deadlineInput).format('YYYY-MM-DD'),
            startdate: moment(this.state.startDateInput).format('YYYY-MM-DD'),
            client: this.state.clientInput,
            billing: this.state.billingInput,
            project: this.state.projectInput,
            type: this.state.typeInput,
            account: this.state.accountInput,
            user: this.state.personInput,
            slackId: userSlack,
            userName: userName,
            accountName: accountName,
            clientName: clientName,
            extraInputs: extraInputs
        }


        var chosenProject = this.state.projectsData.filter(proj => Number(proj.id_project) === Number(this.state.projectInput))
        if(this.state.typeInput === '1'){ data.account = null; data.billing = chosenProject[0].ref_id_billing_mode; }
        else if(this.state.typeInput === '2' || this.state.typeInput === '4'){ data.project = null;}
        else if(this.state.typeInput === '3'){ data.project = null; data.user = this.state.accountInput;}
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token;
        axios.post('/api/tasks/', data, { headers: { Authorization: AuthStr } })
        .then(res => {
            if(res.data.affectedRows){
                Swal.fire({
                    type: 'success',
                    title: 'Nova Tarefa Inserida',
                    text: `A Tarefa '${data.title}' foi inserida com sucesso!`
                  })
                  .then(click => {
                      this.setState({redirect: true, lastInsertedId:res.data.insertId})
                  })
            }
        })
    }


    editTask = (e) => {
        e.preventDefault();
        var data = {
            id: this.props.match.params.id,
            title: this.state.titleInput,
            description: this.state.descInput,
            deadline: moment(this.state.deadlineInput).format('YYYY-MM-DD'),
            startdate: moment(this.state.startDateInput).format('YYYY-MM-DD'),
            client: this.state.clientInput,
            billing: this.state.billingInput,
            project: this.state.projectInput,
            type: this.state.typeInput,
            account: this.state.accountInput,
            user: this.state.personInput,
            oldUser: this.state.taskData.ref_id_user,
            changeUser: Number(this.state.taskData.ref_id_user) === Number(this.state.personInput) ? false : true
        }

        if(this.state.typeInput === '1'){ data.account = null; data.billing = null; }
        else if(this.state.typeInput === '2' || this.state.typeInput === '4'){ data.project = null;}
        else if(this.state.typeInput === '3'){ data.project = null; data.user = null;}
        
        var token = JSON.parse(localStorage.getItem('token'));
        var AuthStr = 'Bearer ' + token;
        axios.put('/api/tasks/', data, { headers: { Authorization: AuthStr } })
        .then(res => {
            if(res.data.affectedRows){
                Swal.fire({
                    type: 'success',
                    title: 'Tarefa Editada',
                    text: `A Tarefa '${data.title}' foi editada com sucesso!`
                  })
                  .then(click => {
                    this.setState({redirect: true})
                })
            }
        })
    }

    
    componentDidMount(){
        if(this.props.type === 'edit'){ this.getTaskData();}
        this.getTypesData();
        this.getClientsData();
        this.getAccountsData();
        this.getBillingData();
        this.getProjectsData();
        this.getUsersData();
    }

    render(){
        return <CreateTask
                title={this.props.title}
                changeTypeInput={this.changeTypeInput}
                changeTitleInput={this.changeTitleInput}
                changeClientInput={this.changeClientInput}
                changeNameInput={this.changeNameInput}
                changeDescInput={this.changeDescInput}
                changeProjectInput={this.changeProjectInput}
                changeDeadlineInput={this.changeDeadlineInput}
                changeStartDateInput={this.changeStartDateInput}
                changeAccountInput={this.changeAccountInput}
                changePersonInput={this.changePersonInput}
                changeBillingInput={this.changeBillingInput}
                changeExtraInputs={this.changeExtraInputs}
                deadlineInput={this.state.deadlineInput}
                startDateInput={this.state.startDateInput}
                clientInput={this.state.clientInput}
                typeInput={this.state.typeInput}
                titleInput={this.state.titleInput}
                descInput={this.state.descInput}
                projectInput={this.state.projectInput}
                accountInput={this.state.accountInput}
                personInput={this.state.personInput}
                billingInput={this.state.billingInput}
                extraInputs={this.state.extraInputs}
                insertTask={this.insertTask}
                editTask={this.editTask}
                typesData={this.state.typesData}
                clientsData={this.state.clientsData}
                accountsData={this.state.accountsData}
                billingData={this.state.billingData}
                projectsData={this.state.projectsData}
                usersData={this.state.usersData}
                taskData={this.state.taskData}
                redirect={this.state.redirect}
                isLoading={this.state.isLoading}
                type={this.props.type}
                error={this.state.error}
                errorMsg={this.state.errorMsg}
                lastInsertedId={this.state.lastInsertedId}
                numberOfExtraInputs={this.state.numberOfExtraInputs}
                increaseNumberOfExtraInputs={this.increaseNumberOfExtraInputs}
                decreaseNumberOfExtraInputs={this.decreaseNumberOfExtraInputs}
                />;
    }
}

export default CreateTaskContainer;
