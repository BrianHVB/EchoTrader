import React from 'react';

import Logger from 'config/logger';
const log = new Logger('chartContainer');

import Chart from '../charts/intra-candle-1/Chart';
import { getData } from "../charts/intra-candle-1/utils"

export default class ChartContainer extends React.Component {
	componentDidMount() {
		getData().then(data => {
			this.setState({ data })
		})
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<Chart type={"hybrid"} data={this.state.data} ratio={1} />
		)
	}
}