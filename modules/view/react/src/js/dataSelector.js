//logging
import Logger from 'config/logger';
const log = new Logger('appContainer');

import React from 'react';


//CSS imports
import 'react-combo-select/style.css';
import 'css/dataSelector.css';

// component imports
import ComboSelect from 'react-combo-select';

// other imports
import intervals from './intervals';


export default class DataSelector extends React.Component {

	periodOptions = [
		{text: "one hour", value: intervals["hour"]}, {text: "four hours", value: intervals["fourHour"]},
		{text: "eight hours", value: intervals["eightHour"]}, {text: "twelve hours", value: intervals["twelveHour"]},
		{text: "day", value: intervals["day"]}, {text: "week", value: intervals["week"]}, {text: "month", value: intervals["month"]}
	];

	intervalOptions = [
		{text: "thirty seconds", value: intervals["base"]}, {text: "minute", value: intervals["minute"]},
		{text: "five minutes", value: intervals["fiveMinute"]}, {text: "fifteen minutes", value: intervals["fifteenMinute"]},
		{text: "half hour", value: intervals["halfHour"]},
		{text: "one hour", value: intervals["hour"]}, {text: "four hours", value: intervals["fourHour"]},
		{text: "eight hours", value: intervals["eightHour"]}, {text: "twelve hours", value: intervals["twelveHour"]},
		{text: "day", value: intervals["day"]}, {text: "week", value: intervals["week"]}, {text: "month", value: intervals["month"]}
	];

	state = {
		period: intervals.week,
		interval: intervals.hour,
	};

	render() {
		return (
			<section id="data-selector">
				<div className="table-cell">
					<div className="option">
						<label className="label">Period:</label>
						<ComboSelect data={this.periodOptions} sort={"off"}  search="on" value={this.state.period}
						             onChange={(val, text) => this.props.comboSelectHandler("period", val)}
						/>
					</div>
					<div className="option">
						<label className="label">Interval:</label>
						<ComboSelect data={this.intervalOptions} sort={"off"} value={this.state.interval}
						             onChange={(val, text) => this.props.comboSelectHandler("interval", val)}/>
					</div>
					<button onClick={this.props.buttonClickHandler}>go!</button>
				</div>
			</section>

		)
	}
}