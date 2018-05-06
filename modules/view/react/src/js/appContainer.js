//logging
import Logger from 'config/logger';
const log = new Logger('appContainer');

import React from 'react';
import ReactDOM from 'react-dom';
import {
	HashRouter as Router,
	Route,
	NavLink,
	Redirect,
	Switch
} from 'react-router-dom'

//CSS imports
import 'react-combo-select/style.css';
import 'css/appContainer.css';


// component imports
import About from './about'
import MarketInfoContainer from './MarketInfoContainer';
import LivePriceGdax from './LivePriceGdax'

// other imports
import DataProvider from './dataProvider';
import intervals from './intervals';


const target = document.getElementById('app');

class App extends React.Component {

	render() {
		return (
			<div id="app">
				<header id="header">

					<nav id="nav-menu">
						<ul className="horizontal-menu">
							<li className="menu-item"><NavLink to="/home" activeClassName="active">Home</NavLink></li>
							<li className="menu-item"><NavLink to="/about" activeClassName="active">About</NavLink></li>
						</ul>
					</nav>

					<h2 id="title">EchoTrader - Market Watch</h2>

				</header>

				<section id="main">
					<Switch>
						<Redirect exact from="/" to="/home"/>
						<Route path="/home">
							<div>
								<section id="markets" className="">
									<ul className="horizontal-menu">
										<div className="menu-item">
											<li><NavLink to="/home/gdax_btc_usd" activeClassName="active">
												<span>BTC-USD</span>
												<LivePriceGdax market={"BTC-USD"}/>
											</NavLink></li>
										</div>
										<div className="menu-item">
											<li><NavLink to="/home/gdax_eth_usd" activeClassName="active">
												<span>ETH-USD</span>
												<LivePriceGdax market={"ETH-USD"}/>
											</NavLink></li>
										</div>
										<div className="menu-item">
											<li><NavLink to="/home/gdax_bch_usd" activeClassName="active">
												<span>BCH-USD</span>
												<LivePriceGdax market={"BCH-USD"}/>
											</NavLink></li>
										</div>
										<div className="menu-item">
											<li><NavLink to="/home/gdax_ltc_usd" activeClassName="active">
												<span>LTC-USD</span>
												<LivePriceGdax market={"LTC-USD"}/>
											</NavLink></li>
										</div>
										<div className="menu-item">
											<li><NavLink to="/home/gdax_eth_btc" activeClassName="active">
												<span>ETH-BTC</span>
												<LivePriceGdax market={"ETH-BTC"}/>
											</NavLink></li>
										</div>



										{/*<li className="menu-item">-- Currently viewing real-time harvested data on Bitcoin (BTC) from GDAX --</li>*/}
									</ul>
								</section>

								<Switch>
									<Redirect exact from="/home" to="/home/gdax_btc_usd"/>
									{/*<Route path="/home/:market" component={MarketInfoContainer}/>*/}
									<Route path="/home/:market" render={(props) => (
										<div id="market-info-container">
											<MarketInfoContainer {...props}/>
										</div>
									)}/>


								</Switch>

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
}

const router =
	<Router>
		<App/>
	</Router>;

ReactDOM.render(router, target);