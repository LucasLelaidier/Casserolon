import React, { Component } from 'react'
import { Link } from "react-router-dom";

import './recette.css';

const parseString = require('xml2js').parseString;

class Recette extends Component {
	constructor(props) {
        super(props);

        this.state = {
            recette: null,
            ingredients: [],
            loaded: false,
            error: false,
        };
    }

	componentDidMount() {
        this.getRecetteRest();
    }
    
    getRecetteRest() {
        let id = this.props.match.params.id;
        // Fetch recette
        fetch(`http://lucaslelaidier.fr:7201/api/recettes/${id}`)
		.then((res) => res.text())
        .then((recette) => {
            parseString(recette, (err, result) => {
                this.setState({ recette: result['recette'] });
            });

            // Fetch ingredients
            fetch(`http://lucaslelaidier.fr:7201/api/ingredients/${id}`)
            .then((res) => res.text())
            .then((ingredients) => {
                parseString(ingredients, (err, result) => {
                    this.setState({ ingredients: result['ingredients'], loaded: true });
                });
                
            }).catch((err) => {
                this.setState({ error: true });
            });
        }).catch((err) => {
            this.setState({ error: true });
        });
    }

    getIngredientsList() {
        if(this.state.ingredients.ingredient !== undefined) {
            let ingredients = [];
            for (let i = 0; i < this.state.ingredients.ingredient.length; i++) {
                ingredients.push(
                    <li key={i}> {this.state.ingredients.ingredient[i]['nom'][0]} : {this.state.ingredients.ingredient[i]['quantite'][0]} {this.state.ingredients.ingredient[i]['unite'][0]} </li>
                );
            }
            return ingredients;
        }
    }

	render() {
        if(this.state.error) {
            return "Error";
        }
        if(!this.state.loaded) {
            return <section id="recette-container" className="loading">
                <div className="important"></div>
                <div className="loader"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>
            </section>
        }

        return (
            <section id="recette-container">
                <div className="important" style={{backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.35057773109243695) 0%, rgba(0,0,0,0.10407913165266103) 61%), url(${this.state.recette['illustration'][0]})`}}>
                    <Link to="/" className="return">
                        <img alt="Retour" src="/arrow-left.svg" title="Retour" />
                    </Link>

                    <Link to={`/edit/${this.state.recette['id'][0]}`} className="return">
                        <img className="edit-icon" alt="Edit" src="/edit-3.svg" title="Editer l'offre" />
                    </Link>
                </div>

                <div className="title-bar">
                    <h2> {this.state.recette['nom'][0]} </h2>
                    <div className="time">
                        <img alt="clock" src="/clock.svg" />
                        <span> {this.state.recette['duree'][0]} min</span>
                    </div>
                </div>

                <div className="infos">
                    <div className="ingredients">
                        <h3> Ingrédients </h3>
                        <ul>
                            {this.getIngredientsList()}
                        </ul>
                    </div>
                    <div className="instructions">
                        <h3> Recette </h3>

                        <p>
                            <span className="step">1 - </span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In hendrerit justo id quam viverra, non lobortis tellus interdum. Integer sagittis nisl ex, semper vulputate ante pretium ut. Curabitur sem mi, tempus a ultricies elementum, <br/><br/>

                            <span className="step">2 - </span>ornare sed orci. Donec quis metus dictum, viverra metus a, dignissim ligula. Ut ornare lorem est, efficitur viverra libero vehicula nec. Quisque eleifend gravida dapibus. Nulla sodales mattis velit, sed maximus nisi elementum quis. Suspendisse condimentum felis quis metus tincidunt blandit. In cursus eu est nec vehicula. <br/><br/>

                            <span className="step">3 - </span>Sed efficitur eget odio vel dapibus. In hac habitasse platea dictumst. Cras accumsan neque est, ac dictum ante eleifend placerat. Maecenas ipsum nulla, pretium a arcu gravida, pellentesque malesuada erat. Suspendisse semper velit accumsan, porttitor ipsum sit amet, tristique massa. Integer ac sem id metus blandit faucibus. Nullam venenatis purus augue, sed condimentum urna tristique vitae. Vivamus sollicitudin erat leo. <br/><br/>
                        </p>
                    </div>
                </div>
            </section>
        );
	}
}

export default Recette;