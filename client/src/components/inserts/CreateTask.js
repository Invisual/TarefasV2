import React from 'react';
import { InsertFormDiv } from '../../styles/inserts'
import { Redirect } from 'react-router'
import DatePicker from 'react-date-picker'
import { FiCalendar, FiPlus, FiX } from 'react-icons/fi';
import {createBrowserHistory} from 'history'
const history = createBrowserHistory()

export const CreateTask = props => {

    if (props.redirect) {
        switch(props.type) {
            case 'edit':
            return <Redirect to={`/tasks/${props.taskData.id_task}`} />
            case 'add':
            return <Redirect to={`/tasks/${props.lastInsertedId}`} />
            default:
            return <Redirect to={`/tasks`} />
        }
    }
    
    var projectsFromActiveClient = props.projectsData.filter(project => {
        return project.ref_id_client === Number(props.clientInput)
    })
    
    var extraFields = []
    for(var i=0, count=props.numberOfExtraInputs; i<count; i++){
        extraFields.push(
            <React.Fragment key={i}>
                <div className="grid50-50 form-grid extra-inputs-grid">
                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Nome</legend>
                                <input required type="text" id={`extra-name-input-${i}`} placeholder="Nome"/>
                            </fieldset>
                        </div>
                    </div>
                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Pessoa</legend>
                                <select required id={`extra-person-input-${i}`} defaultValue={''}>
                                    <option value="" disabled>Selecionar</option>
                                    {props.usersData.map(user => {
                                        return <option key={user.id_user} value={user.id_user}>{user.name_user}</option>
                                    })}
                                </select>
                            </fieldset>
                        </div>
                    </div>
                    <div className="input-row-delete" onClick={props.decreaseNumberOfExtraInputs}><FiX /></div>
                </div>
                
            </React.Fragment>
        )
    }


    return (
        <InsertFormDiv className="insert-edit-form">
            
            {props.usersData.length > 0 ? 

            <div className="cards-container form-container">

                <div className="form-title"><h4 className="widget-title">{props.title}</h4></div>
                <form onSubmit={props.type === 'edit' ? props.editTask : props.insertTask}>
                <div className="grid50-50 form-grid">

                    <div className="grid-item">

                        <div className="grid50-50 inner-grid">
                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    <fieldset>
                                        <legend>Tipo</legend>
                                        <select required id="task-type" onChange={props.changeTypeInput} defaultValue={props.type === 'edit' ? props.typeInput : '1'}>
                                            {props.typesData.map(type => {
                                                return <option key={type.id_task_type} value={type.id_task_type}>{type.name_task_types}</option>
                                            })}
                                        </select>
                                    </fieldset>
                                </div>
                            </div>

                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    <fieldset>
                                        <legend>Cliente</legend>
                                        <select required id="project-client" onChange={props.changeClientInput} defaultValue={props.clientInput}>
                                            <option value="" disabled>Selecionar</option>
                                            {props.clientsData.map(client => {
                                                return <option key={client.id_client} value={client.id_client}>{client.name_client}</option>
                                            })}
                                        </select>
                                    </fieldset>
                                </div>
                            </div>

                        </div>

                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Nome</legend>
                                <input required type="text" id="task-title" onChange={props.changeTitleInput} placeholder="Nome" value={props.type === 'edit' ? props.titleInput : undefined}/>
                            </fieldset>
                        </div>

                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Descrição</legend>
                                <textarea required id="task-briefing" onChange={props.changeDescInput} placeholder="Escrever" value={props.type === 'edit' ? props.descInput : undefined}></textarea>
                            </fieldset>
                        </div>


                    </div>

                    <div className="grid-item">

                        <div className="grid50-50 inner-grid">

                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    {Number(props.typeInput) === 1 ?
                                        <fieldset>
                                            <legend>Projeto</legend>
                                            <select required id="task-project" onChange={props.changeProjectInput} defaultValue={props.projectInput}>
                                                <option value="" disabled>Selecione</option>
                                                {projectsFromActiveClient.map(project => {
                                                    return <option key={project.id_project} value={project.id_project}>{project.title_project}</option>
                                                })}
                                            </select>
                                        </fieldset>    
                                    :
                                        <fieldset>
                                            <legend>Faturação</legend>
                                            <select required id="project-billing" onChange={props.changeBillingInput} defaultValue={props.type === 'edit' ? props.billingInput : ''}>
                                                <option value="" disabled>Selecionar</option>
                                                {props.billingData.map(billing => {
                                                    return <option key={billing.id_billing_mode} value={billing.id_billing_mode}>{billing.name_billing_mode}</option>
                                                })}
                                            </select>
                                        </fieldset> 
                                    }
                                </div>
                            </div>

                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    {props.typeInput === '3' ?
                                    <fieldset>
                                        <legend>Deadline</legend>
                                        <DatePicker id="task-deadline" onChange={props.changeDeadlineInput} format="y-MM-dd" locale="pt-PT" value={new Date(props.deadlineInput)} calendarIcon={<FiCalendar/>}/>
                                    </fieldset>
                                    :
                                    <fieldset>
                                        <legend>Pessoa</legend>
                                        <select required id="task-user" onChange={props.changePersonInput} defaultValue={props.type === 'edit' ? props.personInput : ''}>
                                            <option value="" disabled>Selecionar</option>
                                            {props.usersData.map(user => {
                                                return <option key={user.id_user} value={user.id_user}>{user.name_user}</option>
                                            })}
                                        </select>
                                    </fieldset>
                                    }
                                </div>
                            </div>

                        </div>


                        <div className="grid50-50 inner-grid">
                                    
                            {props.typeInput.toString() === '1' ?
                                null
                            :
                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    <fieldset>
                                        <legend>Account</legend>
                                        <select required id="task-account" onChange={props.changeAccountInput} defaultValue={props.type === 'edit' ? props.accountInput : ''}>
                                            <option value="" disabled>Selecionar</option>
                                            {props.accountsData.map(account => {
                                                return <option key={account.id_user} value={account.id_user}>{account.name_user}</option>
                                            })}
                                        </select>
                                    </fieldset>
                                </div>
                            </div>
                            }
                            
                            {props.typeInput === '3' ?
                                null
                            :
                            <>
                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    <fieldset>
                                        <legend>Data de Início</legend>
                                        <DatePicker id="task-startinddate" onChange={props.changeStartDateInput} format="y-MM-dd" locale="pt-PT" value={new Date(props.startDateInput)} calendarIcon={<FiCalendar/>}/>
                                    </fieldset>
                                </div>
                            </div>
                            
                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    <fieldset>
                                        <legend>Deadline</legend>
                                        <DatePicker id="task-deadline" onChange={props.changeDeadlineInput} format="y-MM-dd" locale="pt-PT" value={new Date(props.deadlineInput)} calendarIcon={<FiCalendar/>}/>
                                    </fieldset>
                                </div>
                            </div>
                            </>
                            }
                            
                        </div>

                    </div>

                </div>


                {props.numberOfExtraInputs > 0 && props.type !== 'edit' ?
                    extraFields
                :
                    null
                }
                
                {Number(props.typeInput) === 1 && props.type === 'add' ? 
                    <div className="add-task-users" onClick={props.increaseNumberOfExtraInputs}>
                        <FiPlus />
                        <span>Adicionar Utilizadores</span>
                    </div>
                : null }
                

                <div className="form-buttons">
                    <button type="button" className="btn secondary-btn" onClick={() => history.goBack()}>Cancelar</button>
                    <button className="btn main-btn">{props.type === 'edit' ? 'Editar' : 'Criar'}</button>
                </div>
                </form>
            </div>

            :

            <img src="/img/loading.svg" alt="Loading" className="loading-spinner" />

            }

        </InsertFormDiv>
    );
}