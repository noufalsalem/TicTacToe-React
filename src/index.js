import React from 'react';
import ReactDOM from 'react-dom';
import './static/style/main.css';
function Square(props) {
    return (
      <button className="square" 
      onClick={props.onClick}>
        {props.value}
      </button>
    );
}

class Board extends React.Component {

  renderSquare(i) {
    return (<
      Square 
      value={this.props.squares[i]} //pass value to Square
      onClick = {() => this.props.onClick(i)} //pass onClick to Square
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

    //jumpTo kinda like a vanilla state
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) 
    {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        //the following: if there is a move, show move # button. either way, show reset button 
      const desc = move ?
      'Go to move #' + move :
      <button className="reset" onClick= {() => this.jumpTo(move)}> Reset </button>;
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
          {desc}
          </button>
        </li>
      );
    });


    let status;
    if (winner && winner!== 'Tie') { 
      status = 'Winner: ' + winner;
    } else if (winner && winner === 'Tie'){
      status = 'Tie';
    } else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [ //rows, columns, and diagonals
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
    else if (!squares.includes(null)){ //ie if squares are NOT empty, but no winner either
      return 'Tie';
    } 
  }
  return null;
}

// ========================================
ReactDOM.render( <Game/>, document.getElementById('root') );
