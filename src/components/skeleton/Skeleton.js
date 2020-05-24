import React from 'react'

import './skeleton.css';

import { Link } from "react-router-dom";

class Header extends React.Component {
    render() {
        return <div id="container">
            <header>
                <img alt="Casserolon" src={process.env.PUBLIC_URL + '/casserolon.svg'} />
                <span className="devise"> Des recettes savoureuses, facilement </span>
            </header>

            {this.props.children}
        </div>
    }
}

export default Header;