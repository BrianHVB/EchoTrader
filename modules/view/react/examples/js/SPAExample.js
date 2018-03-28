import React from 'react';
import ReactDOM from 'react-dom'
import {
	HashRouter as Router,
	Route,
	Link,
	NavLink,
	Switch,
} from 'react-router-dom'

import '../css/SPAExample.css'

const appContainer = document.querySelector("#react-test");

class App extends React.Component {
	render() {
		return (
			<router>
				<div className="app">
					<h1>Simple Single Page App</h1>
					<ul className="header">
						<li className="headerItem"><NavLink to="/" exact activeClassName="active">Home</NavLink></li>
						<li className="headerItem"><NavLink to="/stuff" activeClassName="active">Stuff</NavLink></li>
						<li className="headerItem"><NavLink to="/contact" activeClassName="active">Contact</NavLink></li>
					</ul>
					<div className="content">
						<Switch>
							<Route exact path="/" component={Home}/>
							<Route path="/contact" component={Contact}/>
							<Route path="/stuff" component={Stuff}/>
						</Switch>
					</div>
				</div>
			</router>
		)
	}
}

class Home extends React.Component {
	render() {
		return (
			<div>
				<h2>All your bases belong to me</h2>
				<p>The Lady of the Lake, her arm clad in the purest shimmering samite, held aloft Excalibur from the bosom of the water, signifying by divine providence that I, Arthur, was to carry Excalibur. That is why I am your king.</p>
				<p>And this isn't my nose. This is a false one. A newt? The nose? Shh! Knights, I bid you welcome to your new home. Let us ride to Camelot!</p>
				<p>He hasn't got shit all over him. <strong> But you are dressed as one… Shut up!</strong> <em> Will you shut up?!</em> Be quiet!</p>
				<h2>Shh! Knights, I bid you welcome to your new home. Let us ride to Camelot!</h2>
				<p>Why do you think that she is a witch? Ni! Ni! Ni! Ni! We want a shrubbery!! No, no, no! Yes, yes. A bit. But she's got a wart. Ni! Ni! Ni! Ni!</p>
				<ol>
					<li>The Knights Who Say Ni demand a sacrifice!</li><li>And the hat. She's a witch!</li><li>…Are you suggesting that coconuts migrate?</li>
				</ol>
			</div>
		)
	}
}

class Contact extends React.Component {
	render() {
		return (
			<div>
				<h2>Have questions?</h2>
				<p>Use the contact form on my website at <a href="https://blog.echogy.net/#about">https://blog.echogy.net</a></p>
			</div>
		)
	}
}


class Stuff extends React.Component {
	render() {
		return (
			<div>
				<h1>This is the greatest case of false advertising I've seen since I sued the movie "The Never Ending Story."</h1>
				<p>Aaah! Natural light! Get it off me! Get it off me! Whoa, slow down there, maestro. There's a *New* Mexico? Fat Tony is a cancer on this fair city! He is the cancer and I am the…uh…what cures cancer?</p>
				<p>Oh, I'm in no condition to drive. Wait a minute. I don't have to listen to myself. <strong> I'm drunk.</strong> <em> We started out like Romeo and Juliet, but it ended up in tragedy.</em> Your questions have become more redundant and annoying than the last three "Highlander" movies.</p>
				<h2>Dear Mr. President, There are too many states nowadays. Please, eliminate three. P.S. I am not a crackpot.</h2>
				<p>Facts are meaningless. You could use facts to prove anything that's even remotely true! "Thank the Lord"? That sounded like a prayer. A prayer in a public school. God has no place within these walls, just like facts don't have a place within an organized religion.</p>
				<ol>
					<li>Jesus must be spinning in his grave!</li><li>Mrs. Krabappel and Principal Skinner were in the closet making babies and I saw one of the babies and then the baby looked at me.</li><li>Ahoy hoy?</li>
				</ol>
			</div>
		)
	}
}

const topLevelRouter = (
	<Router>
		<Route path="/" component={App}/>
	</Router>
);


ReactDOM.render(topLevelRouter, appContainer);