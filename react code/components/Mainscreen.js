import React, { Component } from 'react';
import Searchbar from '../components/Searchbar';
import Bookshelf from '../components/Bookshelf';
import DetailsScreen from '../components/DetailsScreen';
import Bookstore from '../stores/Bookstore';
import Social from '../stores/Social';
import '../styles/Mainscreen.css';
import Friendstab from '../components/Friendstab';
import Booklistviewer from './Booklistviewer';
import wallpaper from '../images/wallpaper.jpg'
class Mainscreen extends Component {
    constructor(){
        super();
        this.state={
            show:false,
            showb:false,
            em:"",
            id:"",
            frndstab:false
        }
    }
    render() {
        return (
            <div>
                <Searchbar callback={this.rerender} name={this.props.name} email={this.props.email} />
                <Bookshelf email={this.props.email} />
                {this.state.show &&<div> <DetailsScreen id={this.state.id} email={this.props.email} /><div onClick={this.closeDetails.bind(this)} id="backblur"></div></div>}
                {this.state.frndstab && <Friendstab email={this.props.email} name={this.props.name}/>}
                {this.state.showb && <Booklistviewer em={this.state.em}/>}
                <div><button id="fab" onClick={this.toggle.bind(this)}>>></button></div>
                <img src={wallpaper} id="wallpaper"/>
            </div>
        );
    }

    toggle(){
        if(this.state.frndstab)Social.clearfollow();
        this.setState({
            frndstab:!this.state.frndstab,
            showb:!this.state.showb
        });
    }
    
    closeDetails(){
        this.setState({
            show:false
        });
    }

    componentWillMount(){
        Bookstore.on("show",()=>{
            console.log(Bookstore.getid());
            this.setState({
                show:true,
                id:Bookstore.getid()
            });
        });

        Social.on("showb",()=>{
            this.setState({
                showb:true,
                em:Social.getemail()
            });
        })
    }
}

export default Mainscreen;