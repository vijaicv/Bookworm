import React from 'react';
import Searchbar from './components/Searchbar';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import Book from './components/Book'
import Loginvideo from './components/Loginvideo';
import Loginbox from './components/Loginbox';
import Bookshelf from './components/Bookshelf';
import Mainscreen from './components/Mainscreen';
import registerServiceWorker from './registerServiceWorker';
import axios from 'axios';


ReactDOM.render(<Loginvideo />, document.getElementById('root'));
document.getElementById('intro').addEventListener('ended', myhandler, false);
function myhandler(e) {
    ReactDOM.render(<Loginbox />, document.getElementById('spaceforbox'));
    document.getElementById('loginbtn').addEventListener("click", trytologin, false);
    function trytologin(event) {
        var l_password = document.getElementById("l_pass").value;
        var l_user = document.getElementById("l_user").value;
        console.log(l_user);
        axios.post("/login", { email: l_user, password: l_password })
            .then(
            function (response) {
                if (response.data.isValid == true) {
                    ReactDOM.render(<Mainscreen email={l_user} name={response.data.cause}/>,document.getElementById('root'));
                }
                else {
                    alert(response.data.cause);
                }
            });

    }
}
registerServiceWorker();
