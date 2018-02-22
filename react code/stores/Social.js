import { EventEmitter } from 'events';
import dispatcher from '../dispatcher/Dispatcher';


class Social extends EventEmitter {
    constructor() {
        super();
        this.followlist = [];
        var email;
    }

    follow(email, name) {
        this.followlist.push({ email: email, name: name });
        this.emit("followed");
    }

    unfollow(email){
        var obj=this.followlist.find(o=>o.email===email);
        this.followlist.splice(this.followlist.indexOf(obj),1);
        this.emit("followed");
    }

    checkfollow(email){
        var obj=this.followlist.find(o=>o.email===email);
        if(obj){
            return true;
        }
        return false;
    }

    showbklstof(email) {
        this.email = email;
        this.emit("showb");
    }

    getemail() {
        return this.email;
    }

    getFollowing() {
        return this.followlist;
    }

    clearfollow() {
        this.followlist = [];
    }

    handleActions(action) {
        switch (action.type) {
            case "FOLLOW": {
                this.follow(action.email, action.name);
            } break;
            case "SHOW_BOOKS": {
                this.showbklstof(action.email);
            } break;
            case "UNFOLLOW": {
                this.unfollow(action.email);
            } break;
        }
    }
}

const social = new Social;
window.social = social;
dispatcher.register(social.handleActions.bind(social));
export default social;