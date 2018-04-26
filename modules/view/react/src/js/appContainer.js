//logging
import Logger from 'config/logger';
const log = new Logger('appContainer');

import React from 'react';
import ReactDOM from 'react-dom';
import {
	HashRouter as Router,
	Route,
	NavLink,
	Switch
} from 'react-router-dom'

//CSS imports
import 'react-combo-select/style.css';
import 'css/appContainer.css';


// component imports
import MarketTable from './marketTable';
import ChartContainer from './chartContainer'
import DataSelector from './dataSelector';
import About from './about'

// other imports
import DataProvider from './dataProvider';
import intervals from './intervals';

const target = document.getElementById('app');

class App extends React.Component {

	state = {
		data: null,
		period: intervals.week,
		interval: intervals.hour,

	};

	period = intervals.day;
	interval = intervals.hour;

	componentWillMount() {
		this.getData();
	}

	getData() {
		const dp = new DataProvider();
		log.log(dp);
		this.setState({data: null});
		dp.getData(this.state.period, this.state.interval).then(d => {
			this.setState({data: d});

		})
	}

	render() {
		return (
			<div>
				<header id="header">
					<nav>
						<ul className="horizontal-menu">
							<li className="menu-item"><NavLink exact to="/" activeClassName="active">home</NavLink></li>
							<li className="menu-item"><NavLink to="/about" activeClassName="active">about</NavLink></li>
						</ul>
					</nav>
				</header>

				<section id="main">
					<Switch>
						<Route exact path="/">
							<div>
								<section id="markets" className="">
									<ul className="horizontal-menu">
										{/*<li className="menu-item">BTC-USD</li>*/}
										{/*<li className="menu-item">ETH-USD</li>*/}
										{/*<li className="menu-item">LTC-USD</li>*/}
										<li className="menu-item">-- Currently viewing real-time harvested data on Bitcoin (BTC) from GDAX --</li>
									</ul>
								</section>

								<DataSelector comboSelectHandler={this.comboSelectHandler} buttonClickHandler={this.buttonClickHandler}/>

								<section id="charts">
									<ChartContainer data={this.state.data}/>
								</section>

								<section id="market-data">
									<MarketTable market={'gdax-btc-usd'} data={this.state.data}/>
								</section>
							</div>
						</Route>
						<Route exact path="/about">
							<About/>
						</Route>


					</Switch>

				</section>

			</div>
		);


	}

	comboSelectHandler = (id, val) => {
		log.log(`setting state.${id} to ${val}`);
		this.setState({
			[id]: val
		});
	};

	buttonClickHandler = () => {
		if (this.state.period >= this.state.interval) {
			this.getData();
		}
	}
}

const router =
	<Router>
		<App/>
	</Router>;

ReactDOM.render(router, target);