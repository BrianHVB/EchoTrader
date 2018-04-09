import React from 'react';

import Logger from 'config/logger';
const log = new Logger('chartContainer');

import Chart from '../charts/intra-candle-1/Chart';
import { getData } from "../charts/intra-candle-1/utils"

export default class ChartContainer extends React.Component {
	componentDidMount() {

	}
	render() {

		if (this.props.data == null) {
			log.log("no data yet");
			return <div>Loading...</div>
		}


		log.log("data loaded -- creating chart");
		return (
			<Chart type={"hybrid"} data={this.props.data} ratio={1} />
		)
	}
}