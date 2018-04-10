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
		{Header: "Date/Time", id: 'time', accessor: data => new Date(data.key).toLocaleString('en-US', this.dateOptions), minWidth: 125, maxWidth: this.maxWidth},
		{Header: "Open", id: 'open', accessor: data => +(Number(data.open)).toFixed((2)), maxWidth: this.maxWidth},
		{Header: "High", id: 'high', accessor: data => +(Number(data.high)).toFixed((2)), maxWidth: this.maxWidth},
		{Header: "Low", id: 'low', accessor: data => +(Number(data.low)).toFixed((2)), maxWidth: this.maxWidth},
		{Header: "Close", id: 'close', accessor: data => +(Number(data.close)).toFixed((2)), maxWidth: this.maxWidth},
		{Header: "Volume", id: 'volume', accessor: data => +(data.volume).toFixed(3), maxWidth: this.maxWidth},
		{Header: "Trades", accessor: 'trades', maxWidth: 75},

	];

	componentWillMount() {

	}

	render() {

		const tableStyle = {
			height: 300,

		};

		if (!this.props.data) {
			return <div style={{height: 300}}>Loading...</div>
		}

		const data = this.props.data.slice().reverse();

		return (
			<div className="container">
				<div className="table-container">
					<ReactTable columns={this.columns} data={data} defaultPageSize={50} showPagination={true} />
				</div>
			</div>
		)
	}
}


