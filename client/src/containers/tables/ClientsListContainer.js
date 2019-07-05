import React, { Component } from 'react';
import { ClientsList } from '../../components/tables/ClientsList';
const axios = require('axios');

class ClientsListContainer extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      filteredClients: [],
      placeholder: false,
      counter: 0,
      isLoading: true
    };
  }


  getClients = () => {
    var token = JSON.parse(localStorage.getItem('token'));
    var AuthStr = 'Bearer ' + token;

    var url = this.props.onlyAvencados ? `/api/clients/avencados` : `/api/clients`

    axios.get(url, { headers: { Authorization: AuthStr } }).then(res => {
      if (res.data === 'nodata') {
        if (this._isMounted) { this.setState({ clients: null, isLoading: false }) }
      } else {
        var clientsData = res.data.details
        var newClientsData = clientsData.map(client => {
          var clientHoursObj = res.data.hours ? res.data.hours.filter(hour => hour.id_client === client.id_client) : []
          client.total_hours = clientHoursObj.length > 0 ? clientHoursObj[0].total_hours : null
          return client
          //client.hours = clientHoursObj[0].total_hours
        })
        if (this._isMounted) { this.setState({ clients: newClientsData, filteredClients: newClientsData, isLoading: false }) }
      }
    });
  };

  filterClients = () => {
    this.setState({filteredClients : this.state.clients.filter(client => {
      return this.props.searchQuery === '' ? true : client.name_client.toLowerCase().includes(this.props.searchQuery.toLowerCase())
    })
  },()=>{
        if(this.state.filteredClients.length > 0){
          this.setState({placeholder: false})
        } else {this.setState({placeholder: true})}
      }
    )
  }

  componentDidMount() {
    this._isMounted = true;
    this.getClients();
  }
  
  componentDidUpdate(prevProps){
    if(prevProps.searchQuery !== this.props.searchQuery){
      this.filterClients()
    }
    if(prevProps.onlyAvencados !== this.props.onlyAvencados){
      this.getClients()
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <ClientsList
        clients={this.state.filteredClients}
        type={this.props.type}
        isLoading={this.state.isLoading}
        changeActiveClient={this.props.changeActiveClient}
        activeClient={this.props.activeClient}
        placeholder={this.state.placeholder}
      />
    );
  }
}

export default ClientsListContainer;
