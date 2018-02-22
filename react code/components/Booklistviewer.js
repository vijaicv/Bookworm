import React, { Component } from 'react';
import Social from '../stores/Social';
import '../styles/Booklistviewer.css';
import axios from 'axios';
import Bookinlist from './Bookinlist';

class Booklistviewer extends Component {

    constructor(){
        super();
        this.state={
            lst:[],
            detlist:[],
            showbooks:false
        }
    }
    render() {
        return (
            <div id="booklistbox">
            <div id="emailtag">{this.props.em}</div>
            {!this.state.showbooks && <div id="instruction">Click on a user and then show books to see his book collection..........</div>}
            <div><button id="showbooksbtn" onClick={this.getdata.bind(this)}>Show Books</button></div>
            {this.state.showbooks && <div>{this.state.detlist.map(item=><Bookinlist id={item.id} title={item.title} author={item.author} status={item.status}/>)}</div>}
            </div>
        );
    }

    componentWillMount(){
        Social.on("showb",()=>{
            this.setState({
                detlist:[]
            });
        })
    }

    getdata(){
        axios.post("/booklstof",{email:this.props.em})
        .then((response)=>{
            this.setState({
                lst:response.data.bklst
            },
            this.getfromapi.bind(this)
        );

        })
    }

    getfromapi(){
        var templist=[];
        var tmp=this.state.lst;
      for(var i=0;i<tmp.length;i++){ 
          let status=tmp[i].status;
          axios.get("https://www.googleapis.com/books/v1/volumes/"+this.state.lst[i].bookid)
          .then((response)=>{
                  templist.push({id:response.data.id,title:response.data.volumeInfo.title,author:response.data.volumeInfo.authors[0],status:status});
                  this.setState({
                    detlist:templist,
                    showbooks:true
                  })  
          })
      }
       
    }

}

export default Booklistviewer;