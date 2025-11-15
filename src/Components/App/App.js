import React from 'react';
import * as d3 from 'd3';
import StartMenu from '../StartMenu/StartMenu.js';
import UserInterface from '../UserInterface/UserInterface.js';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    
    this.state = {
      gameStarted: false,
      whosTurn: 'player1',
      checkGameOver: false,
      gameOver: false,
      gameOverReason: '',
      winner: '',
      player1: {
        color: 'red',
        pieces: 12
      },
      player2: {
        color: 'black',
        pieces: 12
      },
      board: {
        squares: [
          //template for square objects (dummy value)
          {id: 1, col: 1, row: 1, width: 75, height: 75, sqColor: "red", x: 0, y: 0, piece: {id: 1, color: 'red', type: 'pawn'},  isEmpty: 'false'}
        ]
      },
      history: [],
    }
    
    this.startGame = this.startGame.bind(this);
    this.updateGame = this.updateGame.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.checkPieces = this.checkPieces.bind(this);
    this.canPlayerMove = this.canPlayerMove.bind(this);
    this.canMoveTo = this.canMoveTo.bind(this);
    this.backtrack = this.backtrack.bind(this);
    this.endGame = this.endGame.bind(this);
  }
  
  startGame(e){
    this.setState({
      gameStarted: true
    });
  }
  
  updateGame(board, whosTurn, checkGameOver, player1Pieces, player2Pieces, history){
    this.setState({
      whosTurn: whosTurn,
      board: Object.assign({}, board),
      checkGameOver: checkGameOver,
      player1: {
        color: 'red',
        pieces: player1Pieces
      },
      player2: {
        color: 'black',
        pieces: player2Pieces
      },
      history: history.slice(0)
    });
  }
  
  /** Updates the state to the chosen history that was clicked. **/
  backtrack(e){
    this.setState(Object.assign({}, this.state.history[e.target.value]));
  }
  
  gameOver(reason, winner){
    this.setState({
      gameOver: true,
      winner: winner,
      gameOverReason: reason
    })
  }
  
  /** End game for debugging **/
  endGame(){
    this.setState({
      player2 : {
        pieces : 0
      },
    })
  }
  
  // Checks if player has any pieces left, if not, gave over!
  checkPieces(){
    let winner;
    
    if (this.state.player1.pieces == 0){
      winner = 'Player 2 (Blue)';
      this.gameOver("player 1 has no more pieces left", winner);
    }
    else if (this.state.player2.pieces == 0){
      winner = 'Player 1 (Red)';
      this.gameOver("player 2 has no more pieces left", winner);
    }
  }
  
  // Checks if player can move, if not, game over!
  canPlayerMove(){
    let isGameOver = true;
    let winner = this.state.whosTurn == "player1" ? 'Player 2 (blue)' : 'Player 2 (red)';
    
    for (let i = 0; (i < this.state.board.squares.length); i++){
      if (this.canMoveTo(this.state.board.squares[i], true).length != 0){
        isGameOver = false;
      }
    }
    
    if(isGameOver){
      this.gameOver('No more moves are left', winner);
    }
  }
  
  // returns array of square id objects that the piece can move to
  canMoveTo(currentSquareState, initialCheck){
  let boardState = Object.assign({}, this.state.board);
  let currentSquareObj = Object.assign({}, currentSquareState);
  let canMoveToSquares = [];
  let opponentColor = this.state.whosTurn == 'player1' ? 'black' : 'red';
  let activePlayerColor = this.state.whosTurn == 'player1' ? 'red' : 'black';
  let stopLoop;
  let direction;
  let pawnMovement = {
    red: {
      upLeft: [-1, -1],
      upRight: [-1, 1],
    },
    black: {
      downLeft: [1, -1],
      downRight: [1, 1],
    } 
  };
  let kingMovement = {
      upLeft: [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]],
      upRight: [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]],
      downLeft: [[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]],
      downRight: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
  };
  
  if (currentSquareState.piece.color == activePlayerColor){
    if (currentSquareState.piece.type == 'pawn'){
      for (let props in pawnMovement[currentSquareObj.piece.color]){
        d3.selectAll('.rect').each(function(d, i){
          if (this.getAttribute('data-row') == (currentSquareObj.row + pawnMovement[currentSquareObj.piece.color][props][0]) && this.getAttribute('data-col') == (currentSquareObj.col + pawnMovement[currentSquareObj.piece.color][props][1])){
            if (this.getAttribute('data-isempty') == 'true'){
              canMoveToSquares.push({sqId: this.getAttribute('data-id'), jumpedPiece: 'none'});
            
              if (initialCheck){
              }
              else{
                this.classList.add('highlight_sq');
              }
            }
            else{ 
              direction = props;
              checkForJumps(this, 'pawn', direction, []);   
            }
          }
        });
      }
    }
    else if (currentSquareState.piece.type == 'king'){
      for (let props in kingMovement){
        stopLoop = 'no';
          
        for (let i = 0; i < kingMovement[props].length; i++){
          if (stopLoop == 'no'){
            d3.selectAll('.rect').each(function(){
              if (this.getAttribute('data-row') == (currentSquareObj.row + kingMovement[props][i][0]) && this.getAttribute('data-col') == (currentSquareObj.col + kingMovement[props][i][1])){
                if (this.getAttribute('data-isempty') == 'true'){
                  canMoveToSquares.push({sqId: this.getAttribute('data-id'), jumpedPiece: 'none'});
                  
                  if(initialCheck){
                  }
                  else{
                    this.classList.add('highlight_sq');
                  }
                }
                else{
                  direction = props;
                  checkForJumps(this, 'king', direction, []);
                  stopLoop = 'yes';
                }
              } 
            })
          }
        }
      }
    }
  }
    
  function checkForJumps(squareToJump, type, direction, _jumpedPieces){
    let moves;
    let addSubCol;
    let upOrDown;
    let nextSqToJump;
    let nextJumpDirection;
    let jumpedPieces = _jumpedPieces.slice(0);
    
    switch(direction){
          case 'upLeft':
            moves = [[-1, 1], [1, -1], [-1, -1]];
            addSubCol = -1;
            upOrDown = -1;
            break;
          case 'upRight': 
            moves = [[1, 1], [-1, 1], [-1, -1]];
            addSubCol = 1;
            upOrDown = -1;
            break;
          case 'downLeft':
            moves = [[1, -1], [1, 1], [-1, -1]];
            addSubCol = -1;
            upOrDown = 1;
            break;
          case 'downRight':
            moves = [[-1, 1], [1, -1], [1, 1]];
            addSubCol = 1;
            upOrDown = 1;
            break;
    }
    
    if (type == 'pawn'){
      if(squareToJump.getAttribute('data-piececolor') == opponentColor){
        d3.selectAll('.rect[data-row="' + (parseInt(squareToJump.getAttribute('data-row')) + upOrDown) + '"][data-col="' + (parseInt(squareToJump.getAttribute('data-col')) + addSubCol) + '"]')
          .each(function(){
            if (this.getAttribute('data-isempty') == 'true'){
              jumpedPieces.push(squareToJump.getAttribute('data-pieceid'));
              canMoveToSquares.push({sqId: this.getAttribute('data-id'), jumpedPieceIds: jumpedPieces});
              
              if(initialCheck){
              }
              else{
                this.classList.add('highlight_sq');
              }
              
              for (let i = 0; i < moves.length; i++){
                nextSqToJump = document.querySelector(`.rect[data-row='${(parseInt(this.getAttribute('data-row')) + moves[i][0])}'][data-col='${(parseInt(this.getAttribute('data-col')) + moves[i][1])}']`);
                
                if (nextSqToJump){
                  switch(JSON.stringify(moves[i])){
                    case '[1,1]':
                      nextJumpDirection = 'downRight';
                      break;
                    case '[-1,-1]': 
                      nextJumpDirection = 'upLeft';
                      break;
                    case '[1,-1]':
                      nextJumpDirection = 'downLeft';
                      break;
                    case '[-1,1]':
                      nextJumpDirection = 'upRight';
                      break;
                  }
                  
                  checkForJumps(nextSqToJump, 'pawn', nextJumpDirection, jumpedPieces);
                }
              }
            }
        });
      }
    }
    else if (type == 'king'){
      if(squareToJump.getAttribute('data-piececolor') == opponentColor){
        d3.selectAll('.rect[data-row="' + (parseInt(squareToJump.getAttribute('data-row')) + upOrDown) + '"][data-col="' + (parseInt(squareToJump.getAttribute('data-col')) + addSubCol) + '"]')
        .each(function(){
          if (this.getAttribute('data-isempty') == 'true'){ 

            jumpedPieces.push(squareToJump.getAttribute('data-pieceid'));
            canMoveToSquares.push({sqId: this.getAttribute('data-id'), jumpedPieceIds: jumpedPieces});
            
            if(initialCheck){     
            }
            else{
              this.classList.add('highlight_sq');
            }

            for (let i = 0; i < moves.length; i++){
              nextSqToJump = document.querySelector(`.rect[data-row='${(parseInt(this.getAttribute('data-row')) + moves[i][0])}'][data-col='${(parseInt(this.getAttribute('data-col')) + moves[i][1])}']`);
             
              if (nextSqToJump){
                 switch(JSON.stringify(moves[i])){
                  case '[1,1]':
                    nextJumpDirection = 'downRight';
                    break;
                  case '[-1,-1]': 
                    nextJumpDirection = 'upLeft';
                    break;
                  case '[1,-1]':
                    nextJumpDirection = 'downLeft';
                    break;
                  case '[-1,1]':
                    nextJumpDirection = 'upRight';
                    break;
                 }

                 checkForJumps(nextSqToJump, 'king', nextJumpDirection, jumpedPieces);
                
              }
            }
          }
        });
      }
    }
  }
  if(initialCheck){              
  }
  else{
    console.log('canMoveToSquares');
    console.log(canMoveToSquares);
  }

  return canMoveToSquares;
}
  
  componentDidUpdate(){
    if (this.state.checkGameOver == true && this.state.gameOver == false){
      this.canPlayerMove();
      this.checkPieces();
    }
  }
  componentDidMount() {}   
  
  render(){
    console.log('this.state');
    console.log(this.state);
    
    return(
      <>
        {this.state.gameStarted 
          ? <UserInterface gameState={this.state} updateGame={this.updateGame} canMoveTo={this.canMoveTo} backtrack={this.backtrack}  endGame={this.endGame}/> 
          : <StartMenu startGame={this.startGame} />}
      </>
    )
  }
}


export default App;