import dispatcher from '../dispatcher/Dispatcher';

export function follow(email,name){
    console.log("dispatch");
    dispatcher.dispatch({
        type:"FOLLOW",
        email:email,
        name:name
    });
}

export function unfollow(email){
    dispatcher.dispatch({
        type:"UNFOLLOW",
        email:email
    });
}

export function showlist(email){
    dispatcher.dispatch({
        type:"SHOW_BOOKS",
        email:email
    });
}