import React, { Component } from 'react'

import './global.css'

import MainRouter from './routes'

class App extends Component {
	render() {
		return (
			<div>
				<MainRouter />
			</div>
		)
	}
}

export default App;