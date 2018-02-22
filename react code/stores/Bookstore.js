import { EventEmitter } from 'events'
import dispatcher from '../dispatcher/Dispatcher'
class Bookstore extends EventEmitter {
    constructor() {
        super();
        this.books = [];
        var bookid="";
    }

    addbook(bookid, thumbnail, title, author,desc ) {
        this.books.push({
            id: bookid,
            thumbnail: thumbnail,
            title: title,
            author: author,
            description:desc
        });
        this.emit("change");
    }

    removeBook(book_id){
        var obj=this.books.find(o=>o.id===book_id);
        this.books.splice(this.books.indexOf(obj),1);
        this.emit("change");
    }
    getAll() {
        return this.books;
    }

    showdetails(id){
        this.bookid=id;
        this.emit("show");
    }
    getid(){
        return this.bookid;
    }
    checkid(id){
        var obj=this.books.find(o=>o.id===id);
        if(obj){
            return true;
        }
        return false;
    }

    handleActions(action) {
        switch(action.type){
            case "ADD_BOOK":{
                this.addbook(action.id,action.thumbnail,action.title,action.author);
            }break;

            case "REMOVE_BOOK":{
                this.removeBook(action.id);
            }break;

            case "SHOW_DETAILS":{
                this.showdetails(action.id);
            }break;
        }
    }
}

const bookstore = new Bookstore;
dispatcher.register(bookstore.handleActions.bind(bookstore));
window.bookstore=bookstore;
export default bookstore;