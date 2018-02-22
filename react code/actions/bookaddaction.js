import dispatcher from '../dispatcher/Dispatcher'

export function addNewBook(id, thumbnail, title, author,description) {
    console.log("ADD_BOOK" + title);
    dispatcher.dispatch({
        type: "ADD_BOOK",
        id: id,
        thumbnail: thumbnail,
        title: title,
        author: author,
        description:description
    });
}

export function removeBook(id) {
    console.log("REMOVE_BOOK" + id);
    dispatcher.dispatch(
        {
            type: "REMOVE_BOOK",
            id: id
        }
    )
}
