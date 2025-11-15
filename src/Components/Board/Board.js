import React from 'react';
import Square from '../Square/Square.js';
import './Board.css';

class Board extends React.Component{
    constructor(props){
      super(props);
    }
    
    componentWillMount() {
      const squaresAmount = 64;
      const sqWidth = 75;
      const sqHeight = 75;
      let sqX = 0;
      let sqY = 0;
      let sqColor = '';
      let sqPieceColor;
      let sqPieceId = -1;
      let isEmpty;
      let boardState = {squares: []};
      let row = 1;
      let col = 1;
      let colorCounter = 0;
      
      for (let i = 1; i <= squaresAmount; i++){
        colorCounter % 2 == 0 ? (sqColor = 'red') : (sqColor = 'black');
        
        if(sqColor == 'black' && i <= 24){
          sqPieceColor = 'black';
          isEmpty = 'false';
          sqPieceId++;
        }
        else if(sqColor == 'black' && i > 40){
          sqPieceColor = 'red';
          isEmpty = 'false';
          sqPieceId++;
        }
        else{
          sqPieceColor = 'none';
          isEmpty = 'true';
        }
        
        boardState.squares.push({id: i, row: row, col: col, x: sqX, y: sqY, width: sqWidth, height: sqHeight, sqColor: sqColor, piece: isEmpty == 'true' ? {} : {id: sqPieceId, color: sqPieceColor, type: 'pawn'}, isEmpty: isEmpty});
        
        sqX += sqWidth;
        
        if (i % 8 == 0){
          sqX = 0;
          sqY += sqHeight;
          col = 1;
          row++;
        }
        else{
          colorCounter += 1;
          col++;
        }
      }
      
      this.props.updateGame(Object.assign({}, boardState), 'player1', this.props.gameState.checkGameOver, this.props.gameState.player1.pieces, this.props.gameState.player2.pieces, this.props.gameState.history.slice(0));
      
    }
    
    componentDidMount() {
  
    }      
    
    render(){
  let boardStyle = {
    maxWidth: '600px',
    maxHeight: '600px'
  }
  
  return(
    <div id="board">
      <svg className="board" viewBox={`0 0 ${this.props.width} ${this.props.height}`} preserveAspectRatio="none meet" style={boardStyle}>
        {this.props.gameState.board.squares.map((sq, i) => {
          return <Square key={sq.id} id={sq.id} colorClass={sq.sqColor} x={sq.x} y={sq.y} width={sq.width} height={sq.height} sqPiece={sq.piece} isEmpty={sq.isEmpty} gameState={this.props.gameState} updateGame={this.props.updateGame} canMoveTo={this.props.canMoveTo}/>
        })}
      </svg>
    </div>
  )
}
}

export default Board;  