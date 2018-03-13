import React from "react";
import ReactDOM from "react-dom";

import "./../css/app.css";


const newElem = function(parent) {
	return parent.appendChild(document.createElement("div"));
};


// simple component as a function
const App = () => {
	return (
		<div>
			<p>Hello from EchoTrader</p>
		</div>
	);
};

// if the component is a function, "invoke" it as an HTML tag
ReactDOM.render(<App />, document.getElementById("app"));





// can just create component directly too,
const App2 =
	<div>
		<h3>I don't need a dam function!</h3>
	</div>;

// if component is an element, just pass it directly
ReactDOM.render(App2, document.querySelector("#react-test"));



// can also render directly too
ReactDOM.render(
	<h1>Sherlock Holmes</h1>,
	document.getElementById("react-test")
);



// preferred method -- create a component as a class that extends React.Component
class HelloWorld extends React.Component {

	// must override render()
	render() {
		//  Use curly braces {} to execute JavaScript code
		// Use this.props.propX to access element properties set on creation
		return (<div>
			<p>Hello, {this.props.name}</p>
			<p>One plus one is {1 + 1}</p>
			{/* this is the only way to insert comments into JSX */}
			<hr/>
		</div>);
	}

}

// create a reference to the container
const testContainer = document.querySelector("#react-test");

// if component is created as a class, no need to call `new`, this happens automagically
// set a property just like any other HTML tag
ReactDOM.render(<HelloWorld name="umm?"/>, newElem(testContainer));


// can only render a single element, but can combine multiple components together
const helloWorlds = (
	<div>
		<HelloWorld name={"umm?"}/>
		<HelloWorld name={"John"}/>
	</div>
);

ReactDOM.render(helloWorlds, newElem(testContainer));






// components also have access to child elements
// inline style in JSX must be passed an object with name/value pairs; note the double-nested curly braces {{}} to create an object
// in the case below, if no color is set, then the color in the included CSS file is used
class Name extends React.Component {
	render() {
		return (
			<div className="name" style={{color: this.props.color}}>{this.props.children}</div>
		);
	}
}

// create a Name element, specifying the color and text value
// the second name uses a property of the parent
// the third name will have a color specified by a bundled CSS file if available
class Greeting extends React.Component {
	render() {
		return (
			<div>
				<p>Hello <Name color={'purple'}>Sam</Name></p>
				<p>Hello <Name color={this.props.defaultColor}>John</Name></p>
				<p>Hello <Name color={null}>Brittany</Name></p>
			</div>
		)
	}
}

ReactDOM.render(<Greeting defaultColor={"orange"}/>, newElem(testContainer));




// The Letter component is really just a container for with a class so that it can be styled
class Letter extends React.Component {
	render() {
		return (
			<div className="letter" style={{backgroundColor: this.props.bgColor}}>
				{this.props.children}
			</div>
		);
	}
}


class Vowels extends React.Component {
	render() {
		return (
			<div className="vowels">
				<Letter bgColor="#58B3FF">H</Letter>
				<Letter bgColor="#FF605F">E</Letter>
				<Letter bgColor={"#FFD52E"}>L</Letter>
				<Letter bgColor={"#49DD8E"}>L</Letter>
				<Letter bgColor={"#AE99FF"}>O</Letter>
			</div>
		)
	}
}

ReactDOM.render(<Vowels/>, newElem(testContainer));







// color pallet card

class Square extends React.Component {
	render() {
		return (
			<div className="square" style={{backgroundColor: this.props.cardColor}}>

			</div>
		)
	}
}

class Label extends React.Component {
	render() {
		return (
			<p className="label">
				{this.props.cardColor}
			</p>
		)
	}
}

class Card extends React.Component {
	render() {
		return (
			<div className="card">
				<Square cardColor={this.props.cardColor}/>
				<Label cardColor={this.props.cardColor}/>
			</div>
		)
	}
}

// create some cards by hand
const cards =
	<div className="cards">
		<Card cardColor={"#FFA737"}/>
		<Card cardColor={"#ABCDEF"}/>
		<Card cardColor={"#13579B"}/>
		<Card cardColor={"#CA8642"}/>
	</div>;

ReactDOM.render(cards, newElem(testContainer));




// do the same thing with a loop
// add individual elements to an array
let cardList = [];
let colors = ["#FFA737", "#ABCDEF", "#13579B", "#CA8642", "#0DEAD0", "#D00F75"];

colors.forEach(color => {
	cardList.push(<Card cardColor={color}/>)
});

//inserting an array as a child element will insert all of the elements it contains
ReactDOM.render(<div>{cardList}</div>, newElem(testContainer));

//using map directly also works
ReactDOM.render(
	<div>
		{colors.map(itm => <Card cardColor={itm}/>)}
	</div>,
newElem(testContainer));






// passing properties down to children
// use spread operator instead of manually passing each prop

class Blob extends React.Component {
	render() {
		return (
			<div>
				<p>{this.props.color}</p>
				<p>{this.props.num}</p>
				<p>{this.props.size}</p>
			</div>
		)
	}
}

class Label2 extends React.Component {
	render() {
		return (
			<div>
				<Blob {...this.props}/>
			</div>
		)
	}
}

class Shirt extends React.Component {
	render() {
		return (
			<div>
				<Label2 {...this.props}/>
			</div>
		)
	}
}

ReactDOM.render(<hr/>, newElem(testContainer));

ReactDOM.render(<Shirt color="blue" num="3.14" size={"medium"}/>, newElem(testContainer));









export default App;
