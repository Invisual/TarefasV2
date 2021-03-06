import React from 'react';
import { InsertFormDiv } from '../../styles/inserts'
import { Redirect } from 'react-router'

export const CreateClientInfo = props => {

    if (props.redirect) {
        return <Redirect to='/' />;
    }

    return (
        <InsertFormDiv>

            {props.clientInfo.hasOwnProperty('id_client') ? 

            <div className="cards-container form-container">

                <div className="form-title"><h4 className="widget-title">{props.title}{props.clientInfo.name_client}</h4></div>
                <form onSubmit={props.editClientInfo}>

                <div className="grid33-33-33 form-grid">

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Link cPanel</legend>
                                <input type="text" onChange={props.changeCpanelLinkInput} placeholder="Escrever" value={props.type === 'edit' ? props.cpanelLinkInput : undefined}/>
                            </fieldset>
                        </div>
                    </div>

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Username cPanel</legend>
                                <input type="text" onChange={props.changeCpanelUserInput} placeholder="Escrever" value={props.type === 'edit' ? props.cpanelUserInput : undefined}/>
                            </fieldset>
                        </div>
                    </div>

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Password cPanel</legend>
                                <input type="text" onChange={props.changeCpanelPassInput} placeholder="Escrever" value={props.type === 'edit' ? props.cpanelPassInput : undefined}/>
                            </fieldset>
                        </div>
                    </div>

                </div>

                <div className="grid33-33-33 form-grid mt10">

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Link WordPress</legend>
                                <input type="text" onChange={props.changeWpLinkInput} placeholder="Escrever" value={props.type === 'edit' ? props.wpLinkInput : undefined}/>
                            </fieldset>
                        </div>
                    </div>

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Username WordPress</legend>
                                <input type="text" onChange={props.changeWpUserInput} placeholder="Escrever" value={props.type === 'edit' ? props.wpUserInput : undefined}/>
                            </fieldset>
                        </div>
                    </div>

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Password WordPress</legend>
                                <input type="text" onChange={props.changeWpPassInput} placeholder="Escrever" value={props.type === 'edit' ? props.wpPassInput : undefined}/>
                            </fieldset>
                        </div>
                    </div>

                </div>


                <div className="grid33-33-33 form-grid mt10">

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>NicHandle DNS</legend>
                                <input type="text" onChange={props.changeDnsNicInput} placeholder="Escrever" value={props.type === 'edit' ? props.dnsNicInput : undefined}/>
                            </fieldset>
                        </div>
                    </div>

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Password DNS</legend>
                                <input type="text" onChange={props.changeDnsPassInput} placeholder="Escrever" value={props.type === 'edit' ? props.dnsPassInput : undefined}/>
                            </fieldset>
                        </div>
                    </div>

                </div>


                <div className="grid50-50 form-grid mt10">

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Emails</legend>
                                <textarea onChange={props.changeEmailsInput} placeholder="ex@exemplo.pt - password," value={props.type === 'edit' ? props.emailsInput : undefined}></textarea>
                            </fieldset>
                        </div>
                    </div>

                    <div className="grid-item">
                        <div className="input-wrapper">
                            <fieldset>
                                <legend>Outros</legend>
                                <textarea onChange={props.changeOthersInput} placeholder="exemplo de conta - password," value={props.type === 'edit' ? props.othersInput : undefined}></textarea>
                            </fieldset>
                        </div>
                    </div>

                </div>


                <div className="form-buttons">
                    <button type="button" className="btn secondary-btn">Cancelar</button>
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