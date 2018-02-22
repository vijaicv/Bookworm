import React, { Component } from 'react';
import '../styles/Loginbox.css';
import loading from '../images/loading.gif';
import axios from 'axios';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
class Loginbox extends Component {

  render() {

    return (

      <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true} transitionAppearTimeout={500} transitionEnter={false} transitionLeave={false}>
        {this.state.loading && <div id="loading_screen"><h2>Setting up your account!<br />just a few secs and we are good to go........</h2>
          {!this.state.finishedloading && <img id="loading_gif" src={loading} />}
          {this.state.finishedloading && <div><h2 id="ready">Hooray! All set & ready to go!</h2><br/>
          <button id="continuebtn" onClick={this.transfer.bind(this)}>Login</button></div>}
        </div>}
        <div id="screen">
          <h2 id="greeting">Bookworm</h2>
          <div id="login_box">
            <b>Login</b><br />

            <input id="l_user" className="field" type="text" placeholder="Email:" /><br />
            <input id="l_pass" className="field" type="password" placeholder="Password:" /><br />
            <button id="loginbtn">Login</button><br/><br/>
            

          </div>
          <div id="signup_container">
            <b>Signup</b><br />
            <input id="s_username" onChange={this.namecheck.bind(this)} className="field" type="text" placeholder="Username:" /><br />
            <div>{!this.state.name && this.state.name_err}</div><br />
            <input id="s_email" onChange={this.emailcheck.bind(this)} className="field" type="text" placeholder="Email:" /><br />
            <div>{!this.state.email && this.state.email_err}</div><br />
            <input id="s_pass" onChange={this.passcheck.bind(this)} className="field" type="password" placeholder="Password:" /><br />
            <div>{!this.state.pass && this.state.pass_err}</div><br />
            <input id="s_cpass" onChange={this.cpasscheck.bind(this)} className="field" type="password" placeholder="Confirm Password:" /><br />
            <div>{!this.state.cpass && this.state.cpass_err}</div><br />
            <button onClick={this.verifier.bind(this)} id="signupbtn">Signup</button>
          </div>
        </div>
      </ReactCSSTransitionGroup>

    );
  }

  constructor() {
    super();
    this.state = {
      finishedloading: false,
      loading:false,
      name: false,
      email: false,
      pass: true,
      cpass: false,
      name_err: "",
      email_err: "",
      pass_err: "",
      cpass_err: ""
    }
  }
  namecheck(evt) {
    var user = evt.target.value;

    if (/^[a-zA-Z0-9]*$/.test(user) == false) {
      evt.target.style.backgroundColor = "#FF8C8A";
      this.setState({ name: false, name_err: "Username must not contain special characters" });
    }
    else {
      evt.target.style.backgroundColor = "white";
      this.setState({ name: true });
    }

  }

  emailcheck(evt) {
    var email = evt.target.value;
    var regexp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (regexp.test(email) == false) {
      evt.target.style.backgroundColor = "#FF8C8A";
      this.setState({ email: false, email_err: "Inavlid email adress" });
    } else {
      evt.target.style.backgroundColor = "white";
      this.setState({ email: true });
    }
  }

  passcheck(evt) {
    var passval = evt.target.value;
    if (passval.length < 6) {
      evt.target.style.backgroundColor = "#FF8C8A";
      this.setState({ pass: false, pass_err: "Password must be atleast 6 characters long" });
    } else {
      evt.target.style.backgroundColor = "white";
      this.setState({ pass: true });
    }
  }

  cpasscheck(evt) {
    var newval = evt.target.value;
    var oldval = document.getElementById("s_pass").value;
    if (newval.localeCompare(oldval) == 0) {
      evt.target.style.backgroundColor = "white";
      this.setState({ cpass: true });
    } else {
      evt.target.style.backgroundColor = "#FF8C8A";
      this.setState({ cpass: false, cpass_err: "passwords do not match" });
    }
  }

  verifier() {

    var s_username = document.getElementById("s_username").value;
    var s_email = document.getElementById("s_email").value;
    var s_pass = document.getElementById("s_pass").value;

    if ((this.state.name && this.state.email) && (this.state.pass && this.state.cpass)) {
      this.setState({loading:true});
      axios.post("/signup", { username: s_username, email: s_email, pass: s_pass })
        .then((response) => {
          console.log(response.data.status);
          if(response.data.status.localeCompare("user added")==0){
          this.setState({ finishedloading: true });
          }
          else{
            alert(response.data.status);
            this.setState({loading:false});
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
    }
  }

  transfer(){
    var l_email = document.getElementById("s_email").value;
    var l_pass = document.getElementById("s_pass").value;
    var l_password = document.getElementById("l_pass");
    var l_user = document.getElementById("l_user");
    
    l_user.value=l_email;
    l_password.value=l_pass;

    this.setState({loading:false});
    document.getElementById("loginbtn").classList.add("blinkassign");

  }
  
}


export default Loginbox;
