import React, { Component } from 'react';
import Social from '../stores/Social';
import '../styles/Bookinlist.css';
import *as details from '../actions/detailsScreen';

class Bookinlist extends Component {

    constructor(){
        super();
        this.state={
            color:{background:"#fff"}
        };
    }
    render() {
        return (
            <div id="bkinlst" onClick={this.showdet.bind(this)}>
                <div id="botitle">{this.props.title}</div>
                <div id="bokauthor">{this.props.author}</div>
                <div><button id="stat" style={this.state.color}>{this.props.status}</button></div>
            </div>
        );
    }

    showdet(){
       details.showdetails(this.props.id);
    }

    componentWillMount(){
        if(this.props.status==="reading")this.setState({color:{background:"#ff3b64"}});
        if(this.props.status==="completed")this.setState({color:{background:"#1b7ff1"}});
        if(this.props.status==="wish to read")this.setState({color:{background:"#ffa500"}});
    }
}

export default Bookinlist;