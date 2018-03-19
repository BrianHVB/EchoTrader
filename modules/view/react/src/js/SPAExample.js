import React from 'react';
import ReactDOM from 'react-dom'

import '../css/SPAExample.css'

const appContainer = document.querySelector("#react-test");

class MyBigBlock extends React.Component {
	render() {
		return (
			<div className="myBigBlock">

			</div>
		)
	}
}


ReactDOM.render(<MyBigBlock/>, appContainer);