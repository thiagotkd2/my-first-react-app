"use client";

import { useState } from "react";

interface SquareProps {
	value:string | null;
	onSquareClick:()=> void;
}
// when to use interface and type
interface BoardProps {
	xIsNext:boolean;
	squares:(null | string)[];
	onPlay: (squares:(null | string)[]) => void;
}


function Square({value, onSquareClick}:SquareProps){ // : {value:string; onSquareClick: ()=> void;}) 
	return <button className="square" onClick={onSquareClick}>{value}</button>
}

function Board({xIsNext,squares,onPlay}:BoardProps){
	function handleClick(i:number):void{
		if(squares[i] || calculateWinner(squares))
			return
		const nextSquares:BoardProps["squares"] = squares.slice()
		if(xIsNext){
			nextSquares[i]='X'
		}else{
			nextSquares[i]='O'
		}

		onPlay(nextSquares)

	}

	const winner = calculateWinner(squares)
	let status:string
	if(winner){
		status = "Winner: " + winner
	}else{
		status = "Next player: " + (xIsNext? "X": "O")
	}

	return (
		<>
			<div className="status">{status}</div>
			<div className="board-row">
				<Square value={squares[0]} onSquareClick={() => handleClick(0)} />
				<Square value={squares[1]} onSquareClick={() => handleClick(1)} />
				<Square value={squares[2]} onSquareClick={() => handleClick(2)} />
			</div>
			<div className="board-row">
				<Square value={squares[3]} onSquareClick={() => handleClick(3)} />
				<Square value={squares[4]} onSquareClick={() => handleClick(4)} />
				<Square value={squares[5]} onSquareClick={() => handleClick(5)} />
			</div>
			<div className="board-row">
				<Square value={squares[6]} onSquareClick={() => handleClick(6)} />
				<Square value={squares[7]} onSquareClick={() => handleClick(7)} />
				<Square value={squares[8]} onSquareClick={() => handleClick(8)} />
			</div>
		</>
	)
}

export default function Game(){
	const [history, setHistory] = useState<BoardProps["squares"][]>([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState<number>(0)
	const xIsNext:boolean = currentMove%2===0
	const currentSquares = history[currentMove]

	function handlePlay(nextSquares:BoardProps["squares"]):void{
		const nextHistory:BoardProps["squares"][] = ([...history.slice(0, currentMove+1), nextSquares])
		setHistory(nextHistory)
		setCurrentMove(nextHistory.length-1)
	}

	function jumpTo(nextMove:number):void{
		setCurrentMove(nextMove)
	}

	const moves= history.map((squares:BoardProps["squares"], move:number) =>{
		let description
		if(move>0){
			description = "Go to move # " + move
		}else{
			description = "Go to game start"
		}
		return(
			<li key={move}>
				<button onClick={() => jumpTo(move)}>{description}</button>
			</li>
		);
	});

	return (
		<div className="game">
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
			</div>
			<div className="game-info">
				<ol>{moves}</ol>
			</div>
		</div>
	)
}


function calculateWinner(squares:BoardProps["squares"]): null | string {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c]:number[] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}