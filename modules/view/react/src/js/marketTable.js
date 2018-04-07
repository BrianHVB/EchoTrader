import React from 'react';
import ReactDOM from 'react-dom';

import request from 'superagent';

import Logger from '../../config/logger';
const log = new Logger('marketTable');


log.log('abc');

import 'css/marketTable.css';

export default class MarketTable extends React.Component {
	render() {



		return (
			<div>
				{this.props.market}
			</div>
		)
	}
}


