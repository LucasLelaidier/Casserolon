import React, { Component } from 'react';

import './ingredientsForm.css';

const parseString = require('xml2js').parseString;

class Recette extends Component {
	constructor(props) {
        super(props);

        this.state = {
            ingredients: [],
            deleted: [],
        }
    }

    componentDidMount() {
        if(this.props.edit !== null && this.props.edit !== undefined) {
            fetch(`http://lucaslelaidier.fr:7201/api/ingredients/${this.props.edit}`)
            .then((res) => res.text())
            .then((ingredients) => {
                parseString(ingredients, (err, result) => {
                    let ingredientsState = [];
                    for (let i = 0; i < result['ingredients'].ingredient.length; i++) {
                        let ingredient = [
                            result['ingredients'].ingredient[i]['nom'][0],
                            result['ingredients'].ingredient[i]['quantite'][0],
                            result['ingredients'].ingredient[i]['unite'][0],
                            result['ingredients'].ingredient[i]['id'][0],
                        ];
                        ingredientsState.push(ingredient);
                    }
                    this.setState({ ingredients: ingredientsState });
                });
                
            }).catch((err) => {
                this.setState({ error: true });
            });
        }
    }

    createUI() {
        return this.state.ingredients.map((el, i) =>
            <li key={i}>
               <input type="text" value={el[0] || ''} placeholder="ex: riz" onChange={this.handleChange.bind(this, i, 0)} /> <span> : </span>
               <input type="number" value={el[1] || ''} className="small" placeholder="300" onChange={this.handleChange.bind(this, i, 1)} /> 
               <input type="text" value={el[2] || ''} className="small" placeholder="g" onChange={this.handleChange.bind(this, i, 2)} />
               <img alt="supprimer" title="supprimer" src="/trash.svg" className="remove" onClick={this.removeClick.bind(this, i)} />
            </li>
        )
    }

    handleChange(i, type, event) {
        let values = [...this.state.ingredients];
        values[i][type] = event.target.value;
        this.setState({ ingredients: values });
    }

    addClick() {
        this.setState(prevState => ({ ingredients: [...prevState.ingredients, ['', '', '']]}))
    }

    removeClick(i) {
        let values = [...this.state.ingredients];

        if(values[i][3] !== undefined) {
            let deleted = [...this.state.deleted];
            deleted.push(values[i][3]);
            this.setState({deleted: deleted });
        }

        values.splice(i, 1);
        this.setState({ ingredients: values });
    }

    handleSubmit(id, callback) {
        let error = false;
        this.state.ingredients.forEach((ingredient, index, array) => {
            let params = new URLSearchParams();
            let type;
            if(ingredient[3] !== undefined) {
                params.append('id', ingredient[3]);
                type = 'PUT';
            } else {
                type = 'POST';
            }

            params.append('nom', ingredient[0]);
            params.append('quantite', ingredient[1]);
            params.append('unite', ingredient[2]);
            params.append('recette', id);
            
            fetch('http://lucaslelaidier.fr:7201/api/ingredients', {
                method: type,
                body: params
            }).then((res) => {
                if(res.status !== 200) {
                    error = true;
                    callback(false);
                } else {
                    if(index === array.length - 1 && error === false) {
                        callback(true);
                    }
                }
            }).catch((err) => {
                callback(false);
            });
        });

        this.state.deleted.forEach((ingredient, index, array) => {
            fetch('http://lucaslelaidier.fr:7201/api/ingredients', {
                method: 'DELETE',
                body: new URLSearchParams({
                    'id': ingredient,
                })
            }).then((res) => {
                if(res.status !== 200) {
                    error = true;
                    callback(false);
                } else {
                    if(index === array.length - 1 && error === false) {
                        callback(true);
                    }
                }
            }).catch((err) => {
                callback(false);
            });
        });
    }

	render() {
        return <ul id="ingredients-form">
            {this.createUI()}
            <li className="add" title="ajouter un ingrédient" onClick={this.addClick.bind(this)}> + ajouter un ingrédient </li>
        </ul>
    }
}

export default Recette;