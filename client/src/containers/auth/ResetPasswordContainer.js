import React, { Component } from 'react';
import { ResetPassword } from '../../components/auth/ResetPassword';

const axios = require('axios');

class ResetPasswordContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            passwordInput: '',
            rePasswordInput: '',
            passwordsMatch: true,
            userId: '',
            randomString: '',
            passwordReseted: false,
            redirect: false
        }
    }

    setPassword = (e) => {
        this.setState({
            passwordInput: e.target.value
        })
    }

    setRePassword = (e) => {
        this.setState({
            rePasswordInput: e.target.value
        })
    }

    changePassword = () => {
        if(this.state.passwordInput !== this.state.rePasswordInput){
            this.setState({
                passwordsMatch: false
            })
        }
        else{
            axios.put('/api/users/changepassword', {
                password: this.state.passwordInput,
                iduser: this.state.userId
            })
            .then((res) => {
                if(res.data.affectedRows === 1){
                    this.setState({
                        passwordReseted: true
                    })
                }
            });
        }
    }

    removeErrors = () => {
        this.setState({
            passwordsMatch: true
        })
    }

    componentDidMount(){
        const { match: { params } } = this.props;
        this.setState({
            userId: params.user,
            randomString: params.randomstring
        }, () => {
            axios.post('/api/users/getrandomstring', {
                iduser: this.state.userId,
                randomstring: this.state.randomString
            })
            .then((res)=>{
                if(res.data === false){
                    this.setState({
                        redirect: true
                    })
                }
            })
        })
    }

    render() {
        return <ResetPassword 
                setPassword={this.setPassword}
                setRePassword={this.setRePassword}
                changePassword={this.changePassword}
                redirect={this.state.redirect}
                passwordsMatch={this.state.passwordsMatch}
                removeErrors={this.removeErrors}
                passwordReseted={this.state.passwordReseted}
                />;
    }
}


export default ResetPasswordContainer;