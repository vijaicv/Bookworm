import React, { Component } from 'react';
import '../styles/Searchbar.css';
import TransitionGroup from 'react-addons-css-transition-group'
import TweenMax from 'gsap';
import ReactDOM from 'react-dom';
import { Motion,spring } from 'react-motion';
import axios from 'axios';
import Book from '../components/Book'

class Searchbar extends Component{
    
    constructor(){
        super();
        this.state={
            results:false,
            isHidden:true
            ,lst:[]
        }
        this.searcht=this.searcht.bind(this);
    }
    makevisible(status){
        this.setState({
            isHidden:false
                      });
    }
    makeinvisible(status){
        this.setState({
            isHidden:true
                      });
        
    }
    
   searcht(event){
                event.preventDefault();
                if(event.keyCode===13){
                    console.log(this.state.update);
                var searchurl="https://www.googleapis.com/books/v1/volumes?q="+document.getElementById("searchbar").value+"&maxResults=20"+"&key=AIzaSyBcDg2W0Lsw_422wZ7rp3sRPAiyEGRZMn4";
                var books=[];var x=this;
                axios.get(searchurl)
                .then(function (response){
                    for(var i=0;i<response.data.items.length;i++){
                      var thumb="",book_title="",book_author="";
                      var bookid=response.data.items[i].id;
                      if(response.data.items[i].volumeInfo.imageLinks.thumbnail){thumb=response.data.items[i].volumeInfo.imageLinks.thumbnail;}
                      if(response.data.items[i].volumeInfo.title){book_title=response.data.items[i].volumeInfo.title;}
                      if(response.data.items[i].volumeInfo.authors[0]){book_author=response.data.items[i].volumeInfo.authors[0];}
                      books.push({id:bookid,thumbnail:thumb,title:book_title,author:book_author});
                    }
                    x.setState({
                      lst:books
                      ,results:false
                    });                 
                }).catch(function (error){
                    console.log(error);
                    x.setState({
                      lst:books
                    });
                    if(books.length===0){
                        x.setState({results:true});
                    }
                });
            }         
    }
    
    logout(){
       if(window.confirm("Are you sure to Logout, Unsaved changes will be lost")){
          window.location.reload(true); 
       }
    }

    render(){
         console.log(this.state.lst);
        return(
                   
                    <div >
                    <table id="actionbar">
                    <tbody>
                    <tr>
                     <td id="nameholder">{this.props.name}</td>
                     <td id="searchbarcell"><input id="searchbar" onKeyUp={this.searcht} onClick={this.makevisible.bind(this)} type="text" placeholder="Search Books...." autoComplete="on"/></td>
                     <td id="logoutholder"><a id="logout" onClick={this.logout.bind(this)}>Logout</a></td>
                    </tr>
                    </tbody>
                    </table>
                    {!this.state.isHidden && <div id="backgroundblur" onClick={this.makeinvisible.bind(this)}></div>}
                    {!this.state.isHidden && <div id="searchresults"><div id="close" onClick={this.makeinvisible.bind(this)}>X</div>{this.state.results && <h2 id="message">Sorry! No results Found</h2>}<div className="grid_container">{this.state.lst.map(item=><Book key={item.id} id={item.id} email={this.props.email} thumbnail={item.thumbnail} title={item.title} author={item.author}/>)}</div></div>}
                    </div>
                             
        );
        
    }

}


export default Searchbar;