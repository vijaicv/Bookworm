import React, { Component } from 'react'
import '../styles/Book2.css'
import book2 from '../images/book2.png'
import Bookstore from '../stores/Bookstore'
import *as details from '../actions/detailsScreen'
class Book2 extends Component {
    render() {
        return (
            <div id="eachbook2">             
                <img onClick={this.popupdetails.bind(this)} src={this.props.thumbnail2}  id="thumbnail2" />
            </div>
        )
    }
    
    popupdetails(){
        details.showdetails(this.props.id);
    }

    
}
export default Book2;