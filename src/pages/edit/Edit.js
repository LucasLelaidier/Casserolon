import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { useToasts } from 'react-toast-notifications';

import './edit.css';

import IngredientsForm from 'components/ingredientsForm/IngredientsForm';

const parseString = require('xml2js').parseString;

function withToast(Component) {
    return function WrappedComponent(props) {
        const toastFuncs = useToasts()
        return <Component {...props} {...toastFuncs} />;
    }
}

class Edit extends Component {
	constructor(props) {
        super(props);

        this.state = {
            edit: null,
            loaded: false,
            error: false,
            submitting: false,

            nom: '',
            duree: '',
            illustration: '',
            etapes: '',
        };

        this.handleChangeNom = this.handleChangeNom.bind(this);
        this.handleChangeDuree = this.handleChangeDuree.bind(this);
        this.handleChangeEtapes = this.handleChangeEtapes.bind(this);
        this.fileInput = React.createRef();
        this.illustration = React.createRef();
        this.ingredientsForm = React.createRef();
    }

	componentDidMount() {
        let id = this.props.match.params.id;

        if(id !== undefined) {
            this.setState({ edit: id });
            this.getRecetteRest(id);
        } else {
            this.setState({ loaded: 'true' });
        }
    }
    
    getRecetteRest(id) {
        // Fetch recette
        fetch(`http://lucaslelaidier.fr:7201/api/recettes/${id}`)
		.then((res) => res.text())
        .then((recette) => {
            parseString(recette, (err, result) => {
                let recette = result['recette'];
                this.setState({ 
                    nom: recette['nom'],
                    duree: recette['duree'],
                    illustration: recette['illustration'],
                    etapes: recette['etapes'],
                });
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
                    <li> {this.state.ingredients.ingredient[i]['nom'][0]} : {this.state.ingredients.ingredient[i]['quantite'][0]} {this.state.ingredients.ingredient[i]['unite'][0]} </li>
                );
            }
            return ingredients;
        }
    }

    submitForm() {
        if(this.state.nom !== '' && this.state.duree !== '' && this.state.illustration !== '' && this.state.etapes !== '' && !this.state.submitting) {
            this.setState({ submitting : true });

            let params = new URLSearchParams({
                'nom': this.state.nom,
                'duree': this.state.duree,
                'illustration': this.state.illustration,
                'etapes': this.state.etapes
            });

            if(this.state.edit != null) {
                params.append('id', this.state.edit);
            }

            fetch('http://lucaslelaidier.fr:7201/api/recettes', {
                method: this.state.edit != null ? 'PUT' : 'POST',
                body: params,
            }).then(res => res.text()).then((res) => {
                this.ingredientsForm.current.handleSubmit(res, this.resultCallback);
            }).catch((err) => {
                this.resultCallback();
                this.setState({ submitting : false });
            });
        }
    }

    resultCallback = (res) => {
        if(res) {
            this.props.addToast(`👩‍🍳 la recette a bien été ajoutée !`, { appearance: 'success', autoDismiss: true });
            this.setState({ submitting : false });
            this.props.history.push('/');
        } else {
            this.props.addToast(`Une erreur est survenue 😥 Impossible d'ajouter la recette`, { appearance: 'error', autoDismiss: true });
            this.setState({ submitting : false });
        }
    }

	render() {
        if(this.state.error) {
            return "Error";
        }
        if(!this.state.loaded) {
            return <section id="edit-container" className="loading">
                <div className="important"></div>
                <div className="loader"><div className="lds-ring"><div></div><div></div><div></div><div></div></div></div>
            </section>
        }

        return (
            <section id="edit-container">
                <label ref={this.illustration} htmlFor="illustration" title="Ajouter une image de la recette" className="important input" style={{background: `center / cover ${this.state.illustration !== 'linear-gradient(0deg, rgba(0,0,0,0.35057773109243695) 0%, rgba(0,0,0,0.10407913165266103) 61%)' ? `url(${this.state.illustration})` : ''}`}}>
                    <Link to="/" className="return" title="Retour">
                        <img alt="Retour" src="/arrow-left.svg" />
                    </Link>
                </label>
                <input ref={this.fileInput} onChange={this.updateIllustration} id="illustration" type="file" />

                <div className="title-bar">
                    <input type="text" className="h2-input" value={this.state.nom} onChange={this.handleChangeNom} placeholder="Nom de la recette" />
                    <div className="time">
                        <img alt="clock" src="/clock.svg" />
                        <span> <input type="number" className="number-input" value={this.state.duree} onChange={this.handleChangeDuree} placeholder="20" /> min</span>
                    </div>
                </div>

                <div className="infos">
                    <div className="ingredients">
                        <h3> Ingrédients </h3>
                        <IngredientsForm  ref={this.ingredientsForm} edit={this.state.edit} errorCallback={() => {}}/>
                    </div>
                    <div className="instructions">
                        <h3> Recette </h3>

                        <textarea value={this.state.etapes} onChange={this.handleChangeEtapes} />
                    </div>
                </div>

                <div className="bot">
                    <button className="submit-button" onClick={() => { this.submitForm() }}> Valider {this.state.submitting ? <div className="lds-ring white"><div></div><div></div><div></div><div></div></div> : ''}</button>
                </div>
            </section>
        );
    }
    
    handleChangeDuree(event) {
        this.setState({duree: event.target.value});
    }

    handleChangeNom(event) {
        this.setState({nom: event.target.value});
    }

    handleChangeEtapes(event) {
        this.setState({etapes: event.target.value});
    }

    updateIllustration = (event) => {
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onloadend = () => {
            this.illustration.current.style.background =  `center / cover url(${reader.result}`;
            this.setState({ illustration: reader.result });
        }
        reader.readAsDataURL(file);
    }
}

export default withToast(Edit);
