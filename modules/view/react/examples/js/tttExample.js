import React from 'react';
import ReactDOM from 'react-dom';
import {
	WebRouter as Router
} from 'react-router-dom';

import _ from 'lodash';
import classNames from 'classnames';

import "./../css/tttExample.css"

const targetContainer = document.querySelector('#react-test');

function Square(props) {

	let cName = classNames('square', {
		'square-winning': props.winner && props.winner.squares.includes(props.id)
	});

	console.log(cName);

	return (
		<button className={cName} onClick={props.onClick}>{props.value}</button>
	);
}

class Board extends React.Component {

	render() {
		return (
			<div>
				<div className="status">{status}</div>
				{_.range(3).map((row) =>
					<div className="board-row" key={row}>
						{_.range(3).map((col) => this.renderSquare(3 * row + col))}
					</div>
				)}
			</div>
		)
	}

	renderSquare(num) {
		return (
			<Square {...this.props} key={num} id={num} onClick={() => this.props.onClick(num)} value = {this.props.squares[num]} />
		);
	}


}

class Game extends React.Component {

	state = {
		history: [
			{
				squares: Array(9).fill(null)
			}
		],
		nextTurn: 'X'
	};

	handleClick = (num) => {
		const history = this.state.history;
		const current = history[history.length - 1];
		const squares = current.squares.slice();

		let nextTurn = this.state.nextTurn;

		if (squares[num] || findWinner(squares)) {
			return;
		}

		squares[num] = nextTurn;
		nextTurn = (nextTurn === 'X') ? ('O') : ('X');

		const newHistory = history.concat([{
			squares: squares
		}]);

		this.setState({
			history: newHistory,
			nextTurn: nextTurn
		});
	};

	jumpTo(moveNumber) {
		const historyCpy = this.state.history.slice(0, moveNumber + 1);

		this.setState({
			history: historyCpy,
			nextTurn: (historyCpy.length % 2 === 1) ? 'X' : 'O'
		})


	}

	render() {
		const history = this.state.history;
		const current = history[history.length - 1];
		const winner = findWinner(current.squares);
		let status = (winner) ? (`Winner: ${winner.symbol}`) : (`Next player: ${this.state.nextTurn}`);

		let moves = history.map((boardState, moveNumber) => {
			const desc = (moveNumber === 0) ? 'Go to game start' : `Go to move # ${moveNumber}`;
			return (
				<li className='historyListItem' key={moveNumber}>
					<button className="historyButton" onClick={() => this.jumpTo(moveNumber)}>{desc}</button>
				</li>
			)
		});

		moves[moves.length - 1] = null;

		moves = moves.reverse();


		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares} onClick={(num) => this.handleClick(num)} winner={winner}/>
				</div>
				<div className="game-info">
					<div className="status">{status}</div>
					<div className="history">
						{moves}
					</div>
				</div>
			</div>
		)
	}
}

function findWinner(squares) {
	const lines = [
		//rows
		[0, 1, 2], [3, 4, 5], [6, 7, 8],
		//columns
		[0, 3, 6], [1, 4, 7], [2, 5, 8],
		//diagonals
		[0, 4, 8], [2, 4, 6]
	];

	for (let line of lines) {
		const [s1, s2, s3] = line;
		const [x1, x2, x3] = [squares[s1], squares[s2], squares[s3]];
		//console.log(`x1: ${x1}\tx2: ${x2}\tx3: ${x3}`);
		if (x1 && x1 === x2  && x2 === x3) {
			return {
				symbol: squares[s1],
				squares: line
			}
		}
	}

	return null;
}

const app = <Game/>;

ReactDOM.render(app, targetContainer);