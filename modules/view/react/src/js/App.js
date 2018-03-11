import React from "react";
import ReactDOM from "react-dom";

import "./../css/app.css";


const App = () => {
	return (
		<div>
			<p>Hello from EchoTrader</p>
		</div>
	);
};

export default App;
ReactDOM.render(<App />, document.getElementById("app"));