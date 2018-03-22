import React from 'react';
import ReactDOM from 'react-dom';
import {
	WebRouter as Router
} from 'react-router-dom';

import "./../css/tttExample.css"

const targetContainer = document.querySelector('#react-test');

class Test extends React.Component {
	render() {
		return (
			<div className="testComponent">I'm a simple test component</div>
		);
	}
}

ReactDOM.render(<Test/>, targetContainer);