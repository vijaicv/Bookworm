import React, { Component } from 'react';
import '../styles/Person.css';
import *as followaction from '../actions/follow';
import axios from 'axios';
import Social from '../stores/Social';


class Person extends Component {
    render() {
        return (
            <div id="person">
                <div onClick={this.viewfriendsbooks.bind(this)}>
                    <div id="un"><b>{this.props.name}</b></div>
                    <div id="mail">{this.props.email}</div>
                </div>
                <button id="follow" onClick={this.follow.bind(this)}>{this.props.todo}</button>
            </div>
        )
    }

    viewfriendsbooks() {
        followaction.showlist(this.props.email);
    }

    follow() {
        var user = this.props.usermail;
        var email = this.props.email;
        var name = this.props.name;
        if (this.props.todo == "Unfollow") {
            console.log("un"+email);
            axios.post("/unfollow", { email: email, usermail: user  })
                .then((response) => {
                    if (response.data.following == true) {
                        alert("Unfollowed " + this.props.name);
                        followaction.unfollow(email);
                    }
                    else {
                        alert("unable to unfollow, check you connection");
                    }

                })
        } else {
            if(!Social.checkfollow(email)){axios.post("/follow", { email: email, name: name, usermail: user })
                .then((response) => {
                    if (response.data.following == true) {
                        alert("You are now following " + this.props.name);
                        followaction.follow(email, name);
                    }
                    else {
                        alert("unable to follow, check you connection");
                    }

                })}
                else{
                    alert("you are already following "+name);
                }
        }
    }
}


export default Person;