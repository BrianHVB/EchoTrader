import React from 'react';
import ReactDOM from 'react-dom';

import 'css/appContainer.css';

const target = document.getElementById('app');

class App extends React.Component {
	render() {
		return (
			<div>
				<header id="header">
					<nav>
						<ul className="horizontal-menu">
							<li className="menu-item">home</li>
							<li className="menu-item">about</li>
						</ul>
					</nav>
				</header>

				<section id="markets" className="">
					<ul className="horizontal-menu">
						<li className="menu-item">BTC-USD</li>
						<li className="menu-item">ETH-USD</li>
						<li className="menu-item">LTC-USD</li>
					</ul>
				</section>

				<section id="market-data">
					table
					open, high, low, close, volume, time, etc
					entry 1
					entry 2
					entry 3
					...
				</section>
				<section id="charts">
					Candle stick chart
				</section>
			</div>
		)
	}
}

ReactDOM.render(<App/>, target);