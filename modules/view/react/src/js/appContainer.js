//logging
import Logger from 'config/logger';
const log = new Logger('appContainer');

import React from 'react';
import ReactDOM from 'react-dom';

import 'css/appContainer.css';

// component imports
import MarketTable from './marketTable';
import ChartContainer from './chartContainer'

// other imports
import DataProvider from './dataProvider';
import intervals from './intervals';

const target = document.getElementById('app');

class App extends React.Component {

	state = {data: null};

	componentWillMount() {
		const dp = new DataProvider();
		log.log(dp);
		dp.getData(intervals.week, intervals.hour).then(d => {
			//d.sort((a, b) => a.key - b.key);
			this.setState({data: d});

		})
	}

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
					<MarketTable market={'gdax-btc-usd'} data={this.state.data}/>
				</section>

				<section id="charts">
					<ChartContainer data={this.state.data}/>
				</section>
			</div>
		)
	}
}

ReactDOM.render(<App/>, target);