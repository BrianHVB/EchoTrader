import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	NavLink
} from 'react-router-dom'

import './../css/todoList.css';

const targetContainer = document.getElementById("react-test");

class TodoList extends React.Component {

	state = {
		tasks: new Map()
	};

	uid = 0;

	constructor() {
		super();
	}

	render() {
		return (
			<div className="todoListContainer">
				<div className="header">
					<form className="form" onSubmit={this.submitHandler}>
						<input className="input" ref={(elm) => this.inputElement = elm} placeholder="enter task"/>
						<button type="submit" className="button">add</button>
						<button type="button" className="button" onClick={this.removeClickHandler}>remove</button>
					</form>
				</div>
				<TodoItems entries={this.state.tasks}/>
			</div>
		)
	}

	submitHandler = (event) => {
		const taskText = this.inputElement.value;
		event.preventDefault();

		this.addTask(taskText);

		this.inputElement.value = '';
		this.inputElement.focus();

		console.log('add task returned')

	};

	removeClickHandler = (event) => {
		this.removeLastTask();
	};

	addTask(taskText) {
		this.setState(prevState => {
			const updatedTasks = prevState.tasks;
			updatedTasks.set(this.uid, taskText);   // use the original, un-incremented uid
			this.uid++;
			return {
				//uid: ++prevState.uid,   // update uid to one more than prev uid
				//tasks: updatedTasks, // set tasks to updated tasks
			}
		}, this.logState);

	}

	removeLastTask() {
		this.setState(prevState => {
			const updatedTasks = prevState.tasks;
			//const updatedUid = prevState.uid - 1;
			this.uid--;
			updatedTasks.delete(this.uid);

			return {
				//uid: updatedUid,
				//tasks: updatedTasks
			}
		})
	}

	logState() {
		console.log('logState() called');
		console.log(this.state);
		console.log("size: " + this.state.tasks.size);
	}
}

class TodoItems extends React.Component {
	render() {
		console.log('TodoItems()');
		const entries = this.props.entries;
		const tasks = Array.from(entries).map( ([key, val]) => <li key={key}>{val}</li> );

		console.log(tasks);

		return (
			<ul className="taskList">
				{tasks}
			</ul>
		)
	}
}

const app = <TodoList/>;

ReactDOM.render(app, targetContainer);