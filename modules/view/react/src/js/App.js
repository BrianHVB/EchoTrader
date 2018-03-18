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
let testContainer = document.querySelector("#react-test");

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
				<div>Hello <Name color={'purple'}>Sam</Name></div>
				<div>Hello <Name color={this.props.defaultColor}>John</Name></div>
				<div>Hello <Name color={null}>Brittany</Name></div>
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

colors.forEach((color, index) => {
	cardList.push(<Card key={index} cardColor={color}/>)
});

//inserting an array as a child element will insert all of the elements it contains
ReactDOM.render(<div>{cardList}</div>, newElem(testContainer));

//using map directly also works
ReactDOM.render(
	<div>
		{colors.map((itm, index) => <Card key={index} cardColor={itm}/>)}
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










// JSX and render() rules
// * You can only return a single root node
// * Can't specify CSS inline, must use an object
// * Reserved words: can't use Javascript words as attribute or tag names
// * Attribute identifiers are camel-cased
// * Comments in the child of a tag must use the { /* comment goes here */ } syntax
// * components must be capitalized, both in JSX and when they are defined
// * tags are lowercase







// 8. Dealing with state

class LightningCounter extends React.Component {

	// Class properties are not supported by ES6 (yet). Using this requires Babel stage-2 or transform-class-properties preset
	state = {
		strikes: 0
	};

	// Without state-2 support, state should be set in constructor
	constructor(props) {
		super(props);

		// this.state = {
		// 	strikesAlt: 0
		// }
	}

	componentDidMount() {

		// tick() needs to this. The context of {this} should be the component, so must use bind (option 1)
		// or create tick2() as a class property using an arrow function
		setInterval(this.tick.bind(this), 1000);
		setInterval(this.tick2, 1000);
	}

	render() {

		return (
			<h1>{this.state.strikes}</h1>
		);
	}

	tick() {
		// using setState here MERGES properties from the new state into the old state, overwriting duplicates
		// when setState is called, and a change occurs, the component's render() gets automatically called
		this.setState({
			strikes: this.state.strikes + 50
		});

	}


	// option 2 - use class properties (needs Babel stage-2 or transform-class-properties) with arrow function
	// arrow functions don't change context of "this"
	tick2 = () => {
		this.setState({
			strikes: this.state.strikes + 50
		});
	}

}

class LightningCounterDisplay extends React.Component {

	render() {
		let commonStyle = {
			margin: 0,
			padding: 0
		};

		let divStyle = {
			width: 250,
			textAlign: "center",
			backgroundColor: "#020202",
			padding: 40,
			fontFamily: "sans-serif",
			color: "cyan",
			borderRadius: 10
		};

		let textStyles = {
			emphasis: {
				fontSize: 38,
				...commonStyle
			},
			smallEmphasis: {
				...commonStyle
			},
			small: {
				fontSize: 17,
				opacity: 0.5,
				...commonStyle
			}
		};



		return (
			<div style={divStyle}>
				<LightningCounter/>
				<h2 style={textStyles.smallEmphasis}>Lightning Strikes</h2>
				<h2 style={textStyles.emphasis}>WORLDWIDE</h2>
				<p style={textStyles.small}>(since you loaded this example)</p>
			</div>
		)
	}
}


testContainer.innerHTML = "";
testContainer = testContainer.appendChild(document.createElement("div"));
//ReactDOM.render(<LightningCounterDisplay/>, testContainer);








// Data

class Circle extends React.Component {
	render() {
		const dynamicStyle = {
			backgroundColor: this.props.bgColor
		};

		return (
			<div className="circle" style={dynamicStyle}/>
		)
	}
}

function makeCircleWithRandomColor() {
	let colors = ["#393E41", "#E94F37", "#1C89BF", "#A1D363"];
	let randomColor = colors[~~(Math.random() * colors.length)];

	return <Circle bgColor={randomColor}/>;

}


function makeColoredCircles() {
	// add a key attribute to each Circle component to fix warning

	let circleColors = ["#393E41", "#E94F37", "#1C89BF", "#A1D363", "#85FFC7", "#297373", "#FF8552", "#A40E4C"];
	let circles = [];

	circleColors.forEach((val, idx) => {
		circles.push(<Circle key={idx} bgColor={val}/>);
	});

	return circles;
}



// Using an array of elements in render() works, but causes a React warning:
//    Warning: Each child in an array or iterator should have a unique key prop
ReactDOM.render(
	<div>
		{makeColoredCircles()}
	</div>, testContainer);

export default App;








// Events
// In React, listen to an event by specifying both the event and the event handler inside the JSX markup for the component

class Counter extends React.Component {
	render() {
		return (
			<div className="counter textStyle">
				{this.props.display}
			</div>
		)
	}
}

class CounterParent extends React.Component {

	state = {
		count: 0
	};

	render() {
		return (
			<div className="counterParent backgroundStyle">
				<Counter display={this.state.count}/>
				<button className="counterParent buttonStyle" onClick={this.increase}>+</button>
			</div>
		)
	}

	increase = (event) => {
		let currentCount = this.state.count;

		if (event.shiftKey) {
			currentCount += 10;
		}
		else {
			currentCount++;
		}

		this.setState({
			count: currentCount
		});
	}
}



ReactDOM.render(<CounterParent/>, testContainer);
