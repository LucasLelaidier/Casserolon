import React, { Component } from 'react'

import './accueil.css'

class Accueil extends Component {
	constructor(props) {
        super(props);

        this.state = {
            recettes: [],
        };
	}
	
	componentDidMount() {
		this.getRecettesRest();
	}

	getRecettesRest() {
		fetch('http://localhost:8080/api/recettes')
			.then(res => res.json())
			.then((articles) => {
				this.setState({ articles: articles })
			});
	}

	render() {
		return (
			<section id="accueil-container">
                <div className="important">
                    <span> Le brunch : découvrez la nouvelle tendance de 2020 </span>
                </div>
			</section>
		)
	}
}

export default Accueil;