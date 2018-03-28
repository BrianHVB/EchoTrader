import React from 'react';
import ReactDOM from 'react-dom';

import 'css/appContainer.css';

const target = document.getElementById('app');

class Test extends React.Component {
	render() {
		return (
			<div className="test">
				TEST
			</div>
		)
	}
}

ReactDOM.render(<Test/>, target);