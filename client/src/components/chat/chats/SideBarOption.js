import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class SideBarOption extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        lastMessage: PropTypes.string,
        active: PropTypes.bool,
        onClick: PropTypes.func
    }
    static defaultProps = {
        lastMessage: "",
        active: false,
        onclick: () => {}
    }
    render() {
        const { name, lastMessage, active, onclick } = this.props
        return (
            <div
                className={`user  ${active ? 'active':''}`}
                onClick={ onclick }
                >
                <div className="user-photo">{name[0].toUpperCase()}</div>
                <div className="user-info">
                    <div className="name">{name}</div>
                    {lastMessage && <div className="last-message">{lastMessage}</div>}
                </div>
            </div>
        )
    }
}