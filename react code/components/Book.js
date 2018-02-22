import React, { Component } from 'react'
import '../styles/Book.css'
import book from '../images/book.png'
import axios from 'axios'
import *as addbookaction from '../actions/bookaddaction';
import *as details from '../actions/detailsScreen';
import Bookstore from '../stores/Bookstore';
class Book extends Component {
  render() {
    return (
      <div id="eachbook" onClick={this.popupdetails.bind(this)}>
        <img src={book} id="bookcover" />
        <img src={this.props.thumbnail} id="thumbnail" />
        <div id="textdata">
          <div id="bk_title">{this.props.title}</div>
          <div id="bk_author">{this.props.author}</div>
        </div>
      </div>
    )
  }


  popupdetails() {
    details.showdetails(this.props.id);
  }


}
export default Book;