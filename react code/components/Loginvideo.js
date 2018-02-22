import React, { Component } from 'react';
import '../styles/Loginvideo.css';

class Loginvideo extends Component{
    render(){
        return(
        <div>
        <div>
            <video id="intro"  muted autoPlay>
                <source src="./intro.mp4" type="video/mp4"/>
            </video>
        </div>
        <div id="spaceforbox">
        
        </div>
        

        </div>
            );
    }
}

export default Loginvideo;