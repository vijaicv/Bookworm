import React, { Component } from 'react';
import axios from 'axios';
import '../styles/DetailsScreen.css';
import Bookstore from '../stores/Bookstore';
import *as addbookaction from '../actions/bookaddaction';
class DetailsScreen extends Component {


    constructor() {
        super();
        this.state = {
            thumbnail: "http://gifimage.net/wp-content/uploads/2017/09/ajax-loading-gif-transparent-background-8.gif",
            title: "loading....",
            author: "loading....",
            description: "loading....",
            rating: "loading",
            status: "Not reading",
            note: "loading..",
            buylink:"",
            msg: ".........",
            rerender: false,
            color:{background:"#000"}
        }
    }
    render() {
        return (
            < div id="detscrn">
                <div id="detscreen">
                    <img id="bookimg" src={this.state.thumbnail} />
                    <div id="text">
                        <div><b>{this.state.title}</b></div>
                        <div>{this.state.author}</div>
                        <div id="description"></div>
                        <div>Rating: {this.state.rating}</div>
                    </div>
                    <div id="buttons">
                        <button id="atlbtn" onClick={this.addtolist.bind(this)}>+ Add</button>
                        <button id="rflbtn" onClick={this.removefromlist.bind(this)}>- Remove</button>
                        <a id="buylink" href={this.state.buylink} target="blank">Buy</a>
                        <div className="dropdown">
                            <div className="types">
                                <div id="reading" className="statusbuttons" onClick={this.setreading.bind(this)}>Reading</div><hr />
                                <div id="completed" className="statusbuttons" onClick={this.setCompleted.bind(this)}>Completed</div><hr />
                                <div id="wishtoread" className="statusbuttons" onClick={this.setwtr.bind(this)}>Wish to read</div>
                            </div>
                            <button id="readstat" style={this.state.color}>{this.state.status}</button>
                        </div>
                    </div>
                    {this.state.rerender && <div id="notepad">
                        <b>Note :</b>
                        <textarea id="note">{this.state.note}</textarea>
                        <div><button id="savenote" onClick={this.savethenote.bind(this)}>+ save</button></div>
                        <div ></div>
                    </div>}
                    <div id="message">{this.state.msg}</div>
                </div>
            </div >
        );
    }


    setreading() {
        document.getElementById("readstat").style.background = "#ff3b64";
        this.setState({
            status: "reading"
        },
            this.toserver
        )
    }

    setCompleted() {
        document.getElementById("readstat").style.background = "#1b7ff1";
        this.setState({
            status: "completed"
        },
            this.toserver
        )
    }

    setwtr() {
        document.getElementById("readstat").style.background = "#ffa500";
        this.setState({
            status: "wish to read"
        },
            this.toserver
        );
    }

    toserver() {
        
        console.log(this.state.status);
        if(Bookstore.checkid(this.props.id)){
            this.setState({
                msg: "saving status...."
            });
        axios.post("/status", { email: this.props.email, id: this.props.id, status: this.state.status })
            .then((response) => {
                if (response.data.saved) {
                    this.setState({
                        msg: "saved status"
                    });
                }
                else {
                    this.setState({
                        msg: "unable to save status"
                    });
                }
            })
        }else{
            alert("First add the book to your list");
        }
    }

    addtolist() {
        var id = this.props.id;
        var email = this.props.email;
        if (Bookstore.checkid(id)) {
            alert("book is already in your Bookshelf");
        }
        else {
            axios.post("/add", { id: this.props.id, email: this.props.email })
                .then((response) => {
                    var status = response.data.status;
                    if (status == true) {
                        alert("book was added");
                        addbookaction.addNewBook(this.props.id, this.state.thumbnail, this.state.title, this.state.author);
                    }
                    else {
                        alert("couldnt add book" + response.status.cause);
                    }
                })
        }
    }

    removefromlist() {
        var id = this.props.id;
        var email = this.props.email;
        if(Bookstore.checkid(this.props.id)){
        axios.post("/remove", { id: this.props.id, email: this.props.email })
            .then((response) => {
                var status = response.data.status;
                if (status == true) {
                    alert("book was removed");
                    addbookaction.removeBook(this.props.id);
                }
                else {
                    alert("couldnt remove book" + response.status.cause);
                }
            })
        }
        else{
            alert("The book is not present in your list");
        }
    }


    componentDidMount() {
        var id = this.props.id;
        var email = this.props.email;
        axios.get("https://www.googleapis.com/books/v1/volumes/" + id)
            .then((response) => {
                this.setState({
                    thumbnail: response.data.volumeInfo.imageLinks.thumbnail,
                    title: response.data.volumeInfo.title,
                    author: response.data.volumeInfo.authors[0],
                    description: response.data.volumeInfo.description,
                    buylink:response.data.saleInfo.buyLink,
                    rating: response.data.volumeInfo.averageRating
                });
            })

        axios.post("/getnote", { email: email, bookid: id })
            .then((response) => {
                this.setState({
                    note: response.data.note,
                    status: response.data.status,
                    rerender: true
                });
            if(this.state.status==="reading")this.setState({color:{background:"#ff3b64"}});
            if(this.state.status==="completed")this.setState({color:{background:"#1b7ff1"}});
            if(this.state.status==="wish to read")this.setState({color:{background:"#ffa500"}});
            })        
            document.getElementById("description").innerHTML=this.state.description;
    }
    componentDidUpdate(){
        document.getElementById("description").innerHTML=this.state.description;
    }
     componentWillUpdate(){
        document.getElementById("description").innerHTML=this.state.description;
     }
    

    savethenote() {
        this.setState({
            msg: "saving note"
        });
        var note = document.getElementById("note").value;
        axios.post("/savenote", { email: this.props.email, bookid: this.props.id, note: note })
            .then((response) => {
                this.setState({
                    msg: "note saved sucessfully"
                });
            })
    }
}
export default DetailsScreen;