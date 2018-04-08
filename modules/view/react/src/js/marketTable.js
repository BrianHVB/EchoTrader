import React from 'react';
import ReactDOM from 'react-dom';
import ReactTable from 'react-table';

import request from 'superagent';

import Logger from 'config/logger';
const log = new Logger('marketTable');


import 'react-table/react-table.css'
import 'css/marketTable.css';




export default class MarketTable extends React.Component {

	state = {
		tableData: []
	};

	maxWidth = 150;

	dateOptions = {year: "2-digit", month: "2-digit", day: "numeric",
						hour: "numeric", minute: "numeric", hourCycle: "h24", hour12: false, };

	columns = [
		{Header: "Date/Time", id: 'time', accessor: data => new Date(data.time).toLocaleString('en-US', this.dateOptions), minWidth: 125, maxWidth: this.maxWidth},
		{Header: "Open", id: 'open', accessor: data => +(Number(data.open)).toFixed((2)), maxWidth: this.maxWidth},
		{Header: "High", id: 'high', accessor: data => +(Number(data.high)).toFixed((2)), maxWidth: this.maxWidth},
		{Header: "Low", id: 'low', accessor: data => +(Number(data.low)).toFixed((2)), maxWidth: this.maxWidth},
		{Header: "Close", id: 'close', accessor: data => +(Number(data.close)).toFixed((2)), maxWidth: this.maxWidth},
		{Header: "Volume", id: 'volume', accessor: data => +(Number(data.volume_in) + Number(data.volume_out)).toFixed(3), maxWidth: this.maxWidth},
		{Header: "Trades", accessor: 'total_trades', maxWidth: 75},

	];

	componentWillMount() {
		request
			.get('http://localhost:8090/api/get_newest/gdax_btc_usd')
			.query({num: 20})
			.then(res => {
				log.table(res.body.data);
				this.setState({tableData: res.body.data});
			})
			.catch(err => log.error(err));
	}

	render() {

		const tableStyle = {
			height: 300,

		};

		return (
			<div className="container">
				<div className="table-container">
					<ReactTable columns={this.columns} data={this.state.tableData} showPagination={false} />
				</div>
			</div>
		)
	}
}


