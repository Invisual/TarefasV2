import React from 'react';
import { InsertFormDiv } from '../../styles/inserts'
import { Redirect } from 'react-router'
import DatePicker from 'react-date-picker'
import { FiCalendar } from 'react-icons/fi';
import {createBrowserHistory} from 'history'
const history = createBrowserHistory()

export const CreateProject = props => {

    if (props.redirect) {
        switch(props.type) {
            case 'edit':
            return <Redirect to={`/projects/${props.projectData.id_project}`} />
            case 'add':
            return <Redirect to={`/projects/${props.lastInsertedId}`} />
            default:
            return <Redirect to={`/projects`} />
        }
    }

    return (
        <InsertFormDiv className="insert-edit-form">

            {props.categoriesData.length > 0 ? 

            <div className="cards-container form-container">

                <div className="form-title"><h4 className="widget-title">{props.title}</h4></div>
                <form onSubmit={props.type === 'edit' ? props.editProject : props.insertProject}>
                <div className="grid50-50 form-grid">

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Nome do Projeto</legend>
                                <input required type="text" id="project-title" onChange={props.changeTitleInput} placeholder="Nome" value={props.type === 'edit' ? props.titleInput : undefined}/>
                            </fieldset>
                        </div>
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Briefing</legend>
                                <textarea required id="project-briefing" onChange={props.changeBriefingInput} placeholder="Escrever" value={props.type === 'edit' ? props.briefingInput : undefined}></textarea>
                            </fieldset>
                        </div>

                        {props.type === 'edit' ?
                            <div className="grid50-50 inner-grid">

                                <div className="innergrid-item">
                                    <fieldset>
                                        <legend>Zeplin</legend>
                                        <input type="text" id="project-zeplin-url" onChange={props.changeZeplinInput} placeholder="Url" value={props.zeplinInput ? props.zeplinInput : undefined}/>
                                    </fieldset>
                                </div>
                                
                                <div className="innergrid-item">
                                    <fieldset>
                                        <legend>Slack</legend>
                                        <input type="text" id="project-slack-url" onChange={props.changeSlackInput} placeholder="ID do Canal" value={props.slackInput ? props.slackInput : undefined}/>
                                    </fieldset>
                                </div>

                            </div>
                        : null }

                    </div>

                    <div className="grid-item">

                        <div className="grid50-50 inner-grid">

                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    <fieldset>
                                        <legend>Cliente</legend>
                                        <select required id="project-client" onChange={props.changeClientInput} defaultValue={props.type === 'edit' ? props.clientInput : ''}>
                                            <option value="" disabled>Selecionar</option>
                                            {props.clientsData.map(client => {
                                                return <option key={client.id_client} value={client.id_client}>{client.name_client}</option>
                                            })}
                                        </select>
                                    </fieldset>
                                </div>
                            </div>

                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    <fieldset>
                                        <legend>Account</legend>
                                        <select required id="project-account" onChange={props.changeAccountInput} defaultValue={props.type === 'edit' ? props.accountInput : ''}>
                                            <option value="" disabled>Selecionar</option>
                                            {props.accountsData.map(account => {
                                                return <option key={account.id_user} value={account.id_user}>{account.name_user}</option>
                                            })}
                                        </select>
                                    </fieldset>
                                </div>
                            </div>

                        </div>


                        <div className="grid50-50 inner-grid">

                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    <fieldset>
                                        <legend>Deadline</legend>
                                        <DatePicker id="project-deadline" onChange={props.changeDeadlineInput} value={new Date(props.deadlineInput)} calendarIcon={<FiCalendar/>}/>
                                    </fieldset>
                                </div>
                            </div>

                            <div className="innergrid-item">
                                <div className="input-wrapper">
                                    <fieldset>
                                        <legend>Faturação</legend>
                                        <select required id="project-billing" onChange={props.changeBillingInput} defaultValue={props.type === 'edit' ? props.billingInput : ''}>
                                            <option value="" disabled>Selecionar</option>
                                            {props.billingData.map(billing => {
                                                return <option key={billing.id_billing_mode} value={billing.id_billing_mode}>{billing.name_billing_mode}</option>
                                            })}
                                        </select>
                                    </fieldset>
                                </div>
                            </div>

                        </div>


                        <div className="grid-100 inner-grid">
                            <div className="innergrid-item">
                                <div className="inputwrapper">
                                    <fieldset>
                                        <legend>Áreas</legend>
                                        <div className="categories-card">
                                            <div className="categories-grid">
                                                {props.categoriesData.map(category => {
                                                    return (
                                                        <div key={category.id_category}>
                                                            <label className="label-container">{category.name_category}
                                                                {props.categoriesArr.indexOf(category.id_category.toString()) === -1 ?
                                                                    <input type="checkbox" value={category.id_category} onClick={props.changeCategoriesArr} />
                                                                :
                                                                    <input type="checkbox" value={category.id_category} onClick={props.changeCategoriesArr} defaultChecked/>
                                                                }    
                                                                <span className="checkmark"></span>
                                                            </label>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>

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