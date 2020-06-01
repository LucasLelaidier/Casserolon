import React, { Component } from 'react'
import RecetteThumbnail from 'components/recetteThumbnail/RecetteThumbnail';

import './accueil.css';

const parseString = require('xml2js').parseString;


class Accueil extends Component {
	constructor(props) {
        super(props);

        this.state = {
			recettes: [],
			loaded: false,
        };
	}
	
	componentDidMount() {
		this.getRecettesRest();
	}

	getRecettesRest() {
		fetch('http://lucaslelaidier.fr:7201/api/recettes/ids')
		.then((res) => res.text())
			.then((recettes) => {
				parseString(recettes, (err, result) => {
					this.setState({ recettes: result, loaded: true });
				});
			});
	}

	render() {
		let recettes = [];

		if(this.state.loaded) {
			for (let i = 0; i < this.state.recettes['ids']['id'].length; i++){
				recettes.push(
					<RecetteThumbnail key={i} id={this.state.recettes['ids']['id'][i]} />
				);
			}
		}

		return (
			<section id="accueil-container">
                <div className="important">
                    <span> Le brunch : découvrez la nouvelle tendance de 2020 </span>
                </div>

                <h2> Nos dernières recettes </h2>
				<div id="articles">
					{recettes}
				</div>
			</section>
		)
	}
}

export default Accueil;