import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	NavLink
} from 'react-router-dom'

import './../css/todoList.css';

const targetContainer = document.getElementById("react-test");

class Test extends React.Component {
	render() {
		return (
			<div>
				I work!
			</div>
		)
	}
}


ReactDOM.render(<Test/>, targetContainer);