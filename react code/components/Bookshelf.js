import React, { Component } from 'react'
import '../styles/Bookshelf.css'
import bookshelf from '../images/bookshelf.jpg'
import Book from '../components/Book'
import Book2 from '../components/Book2'
import axios from 'axios'
import Bookstore from '../stores/Bookstore'
import *as bookaddaction from '../actions/bookaddaction'
class Bookshelf extends Component {
  constructor() {
    super();
    this.state = {
      booklist: Bookstore.getAll(),
    };
  }
  render() {
    return (
      <div>
        <img id="bookshelf" src={bookshelf} />
        <div  id="grid_container"><div id="grid"> {this.state.booklist.map(item => <Book2  key={item.id} id={item.id} thumbnail2={item.thumbnail} title={item.title} author={item.author} />)}</div></div>
      </div>
    );
  }
  componentWillMount() {
    Bookstore.on("change",()=>{
      this.setState({
        booklist:Bookstore.getAll()
      });
    })
    axios.post("/books", { email:this.props.email })
      .then((response) => {
        var books = response.data.books;
        for (var i = 0; i < books.length; i++) {
          axios.get("https://www.googleapis.com/books/v1/volumes/" + books[i].bookid)
            .then((response) => {
              var book_id = response.data.id;
              var book_thumbnail = response.data.volumeInfo.imageLinks.thumbnail;
              var book_title = response.data.volumeInfo.title;
              var book_author = response.data.volumeInfo.authors[0];
              var book_desc = response.data.volumeInfo.description;
              bookaddaction.addNewBook(book_id,book_thumbnail,book_title,book_author,book_desc);
            });
        }
      })
  }
}

export default Bookshelf;