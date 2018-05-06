//logging
import Logger from 'config/logger';
const log = new Logger('LivePrice');

//React
import React from 'react';

//CSS imports
import 'css/LivePrice.css';

//other
import GdaxSocketConnection from './GdaxSocketConnection';

export default class LivePriceGdax extends React.Component {

	state = {
		price: null,
		direction: '',
		directionSymbol: '',
		directionSymbolSize: 'inherit',
	};

	listProps(obj) {
		Object.keys(obj).forEach(key => log.log(key));
	}

	constructor() {
		super();

		this.socket = new GdaxSocketConnection();
		//this.socket = {connect: function() {}, on: function() {}};

		this.socket.on("connected", () => {
			log.log(`Subscribing to ${this.props.market}`);
			this.socket.subscribe(this.props.market, "ticker")
		});
		this.socket.connect();

	}

	componentWillMount() {
		this.socket.on('tick', this.onTick);
	}


	componentWillUnmount() {
		log.log("Component unmounting: clearing event listeners and closing connection");
		this.socket.removeAllListeners('tick');
		this.socket.close();
	}


	render() {

		const directionStyle = {
			fontSize: this.state.directionSymbolSize
		};

		return (
			<div>
				<div id="live_price_direction" className={this.state.direction} style={directionStyle}>
					{this.state.directionSymbol}
				</div>
				<div id="live_price">
					{this.state.price ? (this.getSymbol() + parseFloat(this.state.price).toFixed(2)) : "....."}
				</div>
				<div id="live_price_direction" className={this.state.direction} style={directionStyle}>
					{this.state.directionSymbol}
				</div>
			</div>
		)
	}

	getSymbol() {
		const market = this.props.market.toLowerCase();
		if (market.endsWith("usd")) {
			return '$';
		}
		else if (market.endsWith("btc")) {
			return '\u0E3F';
		}
	}

	firstTick = true;
	onTick = (market, data) => {
		if (market === this.props.market && data.price) {
			const oldPrice = this.state.price;
			const newPrice = data.price;
			let newDirection = this.state.direction;
			let newDirectionSymbol = this.state.directionSymbol;

			if (this.firstTick) {
				this.firstTick = false;
				newDirection = "";
				newDirectionSymbol = "";
			}
			else if (newPrice > oldPrice) {
				newDirection = 'up';
				newDirectionSymbol = '▲';
			}
			else if (newPrice < oldPrice) {
				newDirection = 'down';
				newDirectionSymbol = '▼'
			}


			this.setState({
				price: data.price,
				direction: newDirection,
				directionSymbol: newDirectionSymbol,
			}, () => this.flashSymbol());
		}
	};

	flashSymbol() {
		log.log("flashSymbol()");
		this.setState({directionSymbolSize: 'larger'});
		setTimeout(() => this.setState({directionSymbolSize: 'inherit'}), 350);

	}
}
