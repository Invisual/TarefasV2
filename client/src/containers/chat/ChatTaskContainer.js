import React, { Component } from 'react'
import Layout from '../../components/chat/Layout'
import '../../styles/chat.css'

class ChatTaskContainer extends Component {
  render() {
    return (
        <Layout userInfo={this.props.userInfo}/>
    );
  }
}

export default ChatTaskContainer;
