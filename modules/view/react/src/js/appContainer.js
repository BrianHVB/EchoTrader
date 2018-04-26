//logging
import Logger from 'config/logger';
const log = new Logger('appContainer');

import React from 'react';
import ReactDOM from 'react-dom';

//CSS imports
import 'react-combo-select/style.css';
import 'css/appContainer.css';


// component imports
import MarketTable from './marketTable';
import ChartContainer from './chartContainer'
import ComboSelect from 'react-combo-select';
import DataSelector from './dataSelector';

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

		const timeOptions = Object.entries(intervals).map((key, value) => {
			return {
				text: key[0],
				value: key[1]
			}
		});

		const periodOptions = [
			{text: "one hour", value: intervals["hour"]}, {text: "four hours", value: intervals["fourHour"]},
			{text: "eight hours", value: intervals["eightHour"]}, {text: "twelve hours", value: intervals["twelveHour"]},
			{text: "day", value: intervals["day"]}, {text: "week", value: intervals["week"]}, {text: "month", value: intervals["month"]}];

		const intervalOptions = [
			{text: "thirty seconds", value: intervals["base"]}, {text: "minute", value: intervals["minute"]},
			{text: "five minutes", value: intervals["fiveMinute"]}, {text: "fifteen minutes", value: intervals["fifteenMinute"]},
			{text: "half hour", value: intervals["halfHour"]},
			{text: "one hour", value: intervals["hour"]}, {text: "four hours", value: intervals["fourHour"]},
			{text: "eight hours", value: intervals["eightHour"]}, {text: "twelve hours", value: intervals["twelveHour"]},
			{text: "day", value: intervals["day"]}, {text: "week", value: intervals["week"]}, {text: "month", value: intervals["month"]}];

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

				<section id="main">

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

ReactDOM.render(<App/>, target);