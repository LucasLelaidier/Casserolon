import React from 'react';
import './recetteThumbnail.css';
import { Link } from "react-router-dom";

const parseString = require('xml2js').parseString;

class RecetteThumbnail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			recette: null,
			loaded: false,
        };
    }

    componentDidMount() {
		this.getRecetteRest();
    }
    
    getRecetteRest() {
        fetch(`http://lucaslelaidier.fr:7201/api/recettes/${this.props.id}`)
		.then((res) => res.text())
			.then((recette) => {
				parseString(recette, (err, result) => {
					this.setState({ recette: result['recette'], loaded: true });
				});
			});
    }
    
    render () {
        if(this.state.loaded) {
            return <Link to={`/recette/${this.props.id}`} className="recette-thumbnail" style={{backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.43461134453781514) 0%, rgba(0,0,0,0.10407913165266103) 35%), url(${this.state.recette['illustration'][0]})`}}>
                <span> {this.state.recette['nom'][0]} </span>
            </Link>
        } else {
            return <div className="recette-thumbnail loading">
                <span> Chargement... </span>
            </div>
        }
        
    }
}

export default RecetteThumbnail;