import React, { Component } from 'react';
import '../styles/Friendstab.css';
import axios from 'axios';
import Person from '../components/Person';
import Social from '../stores/Social';
import *as followaction from '../actions/follow';

class Friendstab extends Component {
    constructor(){
        super();
        this.state={
            list:[],
            followlist:Social.getFollowing()
        }
    }
    render() {
        return (
            <div id="container">
                <h2 id="title">{this.props.name}</h2><hr />
                <input id="friendssearch" onKeyUp={this.searchforfriends.bind(this)} placeholder="Find others like you..." type="text" />
                <div>
                    {this.state.list.map(item=><Person name={item.username} usermail={this.props.email} email={item.email} todo="follow"/>)}
                </div>
                <div id="followingtag">Following :</div><hr/>
                <div id="following">
                    {this.state.followlist.map(item=><Person name={item.name} usermail={this.props.email} email={item.email} todo="Unfollow"/>)}
                </div>
            </div>
        )
    }

    searchforfriends(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            var searchterm=document.getElementById("friendssearch").value;
            if(searchterm){
                axios.post("/searchothers",{searchterm:searchterm})
                .then((response)=>{
                    var list=response.data.list;
                    this.setState({
                         list:list
                    });
                })
            }
          
        }
    }

    componentWillMount(){
        Social.on("followed",()=>{
          this.setState({
            followlist:Social.getFollowing() 
          });
        });

        axios.post("/getfollowing",{email:this.props.email})
        .then((response)=>{
            var flist=response.data.flist;
            for(var i=0;i<flist.length;i++){
               followaction.follow(flist[i].email,flist[i].name);
            }
        })
        }
}

export default Friendstab;