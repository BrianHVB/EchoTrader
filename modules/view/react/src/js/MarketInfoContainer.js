//logging
import Logger from 'config/logger';
const log = new Logger('appContainer');

import React from 'react';
import {
	HashRouter as Router,
	Route,
	NavLink,
	Redirect,
	Switch
} from 'react-router-dom'

//CSS imports
import 'css/marketInfoContainer.css';

// component imports
import MarketTable from './marketTable';
import ChartContainer from './chartContainer'
import DataSelector from './dataSelector';

// other imports
import DataProvider from './dataProvider';
import intervals from './intervals';


export default class MarketInfoContainer extends React.Component {

	period = intervals.day;
	interval = intervals.hour;

	state = {
		data: null,
		period: intervals.week,
		interval: intervals.hour,

	};

	componentWillMount() {
		this.getData(this.props.match.params.market);
	}

	componentWillReceiveProps(newProps) {
		const oldMarket = this.props.match.params.market;
		const newMarket = newProps.match.params.market;
		if (newMarket !== oldMarket) {
			this.getData(newMarket);
		}

	}

	getData(market) {
		const dp = new DataProvider();
		log.log(dp);
		log.log(this.props);
		this.setState({data: null});
		log.log(`market: ${this.props.match.params.market}`);
		dp.getData(market, this.state.period, this.state.interval).then(d => {
			this.setState({data: d});

		})
	}

	render() {
		return (
			<section id="market-info-container">

				<DataSelector comboSelectHandler={this.comboSelectHandler} buttonClickHandler={this.buttonClickHandler}/>

				<section id="charts">
					<ChartContainer data={this.state.data}/>
				</section>

				<section id="market-data">
					<MarketTable market={'gdax-btc-usd'} data={this.state.data}/>
				</section>

			</section>

		)
	}

	comboSelectHandler = (id, val) => {
		log.log(`setting state.${id} to ${val}`);
		this.setState({
			[id]: val
		});
	};

	buttonClickHandler = () => {
		if (this.state.period >= this.state.interval) {
			this.getData(this.props.match.params.market);
		}
	}
}