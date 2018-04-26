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

// other imports
import DataProvider from './dataProvider';
import intervals from './intervals';


const target = document.getElementById('app');

class App extends React.Component {


	render() {
		return (
			<div>
				<header id="header">
					<nav>
						<ul className="horizontal-menu">
							<li className="menu-item"><NavLink to="/home" activeClassName="active">home</NavLink></li>
							<li className="menu-item"><NavLink to="/about" activeClassName="active">about</NavLink></li>
						</ul>
					</nav>
				</header>

				<section id="main">
					<Switch>
						<Redirect exact from="/" to="/home"/>
						<Route path="/home">
							<div>
								<section id="markets" className="">
									<ul className="horizontal-menu">
										<li className="menu-item"><NavLink to="/home/gdax_btc_usd" activeClassName="active">BTC-USD</NavLink></li>
										<li className="menu-item"><NavLink to="/home/gdax_eth_usd" activeClassName="active">ETH-USD</NavLink></li>
										<li className="menu-item"><NavLink to="/home/gdax_ltc_usd" activeClassName="active">LTC-USD</NavLink></li>
										{/*<li className="menu-item">-- Currently viewing real-time harvested data on Bitcoin (BTC) from GDAX --</li>*/}
									</ul>
								</section>

								<Switch>
									<Redirect exact from="/home" to="/home/gdax_btc_usd"/>
									{/*<Route path="/home/:market" component={MarketInfoContainer}/>*/}
									<Route path="/home/:market" render={(props) => (
										<MarketInfoContainer {...props}/>
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