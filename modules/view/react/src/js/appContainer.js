import React from 'react';
import ReactDOM from 'react-dom';

import 'css/appContainer.css';

// component imports
import MarketTable from './marketTable';

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
					<MarketTable market={'gdax-btc-usd'}/>
				</section>
				<section id="charts">
					Candle stick chart
				</section>
			</div>
		)
	}
}

ReactDOM.render(<App/>, target);