import React from 'react';
import * as d3 from 'd3';
import './CheckerPiece.css';

class CheckerPiece extends React.Component{
    constructor(props){
      super(props);
      
      this.draggedPiece = null;
      
      this.dragended = this.dragended.bind(this);
      this.dragstarted = this.dragstarted.bind(this);
      this.drag = this.drag.bind(this);
    }
    
    playerTurnEnd(board, whosTurn, checkGameOver, redPieces, blackPieces, history) {
      this.props.updateGame(board, whosTurn, checkGameOver, redPieces, blackPieces, history);
    }
    
    
    dragstarted(event, d) {
      this.draggedPiece = event.sourceEvent.target.closest('.checkerPiece');
      const piece = this.draggedPiece;
      
      piece.style.cursor = 'grabbing';
      piece.setAttribute('data-prev-CenterX', piece.firstChild.getAttribute('cx'));
      piece.setAttribute('data-prev-CenterY', piece.firstChild.getAttribute('cy'));
      
      if(piece.children[1]){
        piece.setAttribute('data-prev-TextX', piece.children[1].getAttribute('x'));
        piece.setAttribute('data-prev-TextY', piece.children[1].getAttribute('y'));
      }
      
      let currentSquareState = Object.assign({}, this.props.gameState.board.squares[piece.getAttribute('data-sqid') - 1]);
      this.props.canMoveTo(currentSquareState);
    }
  
    drag(event, d) {
      const piece = this.draggedPiece;
      if (!piece) return;
      
      d3.select(piece.firstChild)
        .attr("cx", parseInt(piece.firstChild.getAttribute('cx')) + parseInt(event.dx))
        .attr("cy", parseInt(piece.firstChild.getAttribute('cy')) + parseInt(event.dy));
      
      if(piece.children[1]){
        d3.select(piece.children[1])
          .attr('x', parseInt(piece.children[1].getAttribute('x')) + parseInt(event.dx))
          .attr("y", parseInt(piece.children[1].getAttribute('y')) + parseInt(event.dy));
      }
    }
  
    dragended(event, d) {
      const piece = this.draggedPiece;
      if (!piece) return;
      
      let gameState = Object.assign({}, this.props.gameState); 
      let currentPiece = d3.select(piece);
      let currentPieceCircle = d3.select(piece.firstChild);
      let currentPieceText = piece.children[1] ? d3.select(piece.children[1]) : 'none';
      let pieceCenterX = currentPieceCircle.attr('cx');
      let pieceCenterY = currentPieceCircle.attr('cy');
      let overallDistance = 999999999999;
      let chosenSq;
      let updatedBoard = Object.assign({}, {squares: []});
      let whosTurn = this.props.gameState.whosTurn;
      let currentSquareState = Object.assign({}, this.props.gameState.board.squares[piece.getAttribute('data-sqid') - 1]);
      let redPieces = this.props.gameState.player1.pieces;
      let blackPieces = this.props.gameState.player2.pieces;
      let redPiecesJumped = 0;
      let blackPiecesJumped = 0;
      let stopLoop = false;
      let history = gameState.history.slice(0);
      
      piece.style.cursor = 'grab';
      
      d3.selectAll('.rect').each(function(){
        let distanceX = this.getAttribute('data-centerx') - pieceCenterX;
        let distanceY = this.getAttribute('data-centery') - pieceCenterY;
        distanceX = Math.abs(distanceX);
        distanceY = Math.abs(distanceY);
        let distance = distanceX + distanceY;
        
        if (distance < overallDistance){
          overallDistance = distance;
          chosenSq = this;
        }
      });
  
      if(this.props.canMoveTo(currentSquareState).length == 0){
        currentPieceCircle.attr('cx', currentPiece.attr('data-prev-CenterX')).attr('cy', currentPiece.attr('data-prev-CenterY'));
        if(currentPieceText != 'none'){
          currentPieceText.attr('x', currentPiece.attr('data-prev-TextX')).attr('y', currentPiece.attr('data-prev-TextY'));
        }
      }
  
      this.props.canMoveTo(currentSquareState).forEach((obj, i)=>{
        if (chosenSq.getAttribute('data-id') == obj.sqId && stopLoop == false){
          stopLoop = true;
  
          updatedBoard.squares = this.props.gameState.board.squares.map((s)=>{
            let sq = Object.assign({}, s);
            let sqPiece = Object.assign({}, sq.piece);
            
            if(sq.id == chosenSq.getAttribute('data-id')){
              sqPiece.id = currentPiece.attr('data-id');
              sqPiece.color = currentPiece.attr('data-color');
              sq.isEmpty = 'false';
  
              if ((sqPiece.color == 'red' &&  chosenSq.getAttribute('data-row') == '1') || (sqPiece.color == 'black' &&  chosenSq.getAttribute('data-row') == '8')){
                sqPiece.type = 'king';
              }
              else{
                sqPiece.type = currentPiece.attr('data-type');
              }
            }
            if(sq.id == currentPiece.attr('data-sqid')){
              sqPiece = {};
              sq.isEmpty = 'true';
            }
            if(obj.jumpedPieceIds){
              for (let j = 0; j <= i; j++){
                if(sqPiece.id == parseInt(obj.jumpedPieceIds[j])){
                  sqPiece = {};
                  sq.isEmpty = 'true';
                  currentPiece.attr('data-color') == 'red' ? blackPiecesJumped++ : redPiecesJumped++;
                }
              }
            }
            
            sq.piece = sqPiece;
            return sq;
          })
  
          whosTurn = whosTurn == 'player1' ? 'player2' : 'player1';
          history.push(gameState);
          this.playerTurnEnd(updatedBoard, whosTurn, true, redPieces - redPiecesJumped, blackPieces - blackPiecesJumped, history);
        }
        else{
          currentPieceCircle.attr('cx', currentPiece.attr('data-prev-CenterX')).attr('cy', currentPiece.attr('data-prev-CenterY'));
          if(currentPieceText != 'none'){
            currentPieceText.attr('x', currentPiece.attr('data-prev-TextX')).attr('y', currentPiece.attr('data-prev-TextY'));
          }
        }
      });
      
      d3.selectAll('.rect').each(function(){
        this.classList.remove('highlight_sq');
      });
      
      this.draggedPiece = null;
    } 
    
    componentDidMount(){
      d3.selectAll('.checkerPiece[data-active=false]')
        .call(d3.drag()
              .on('start', null)
              .on('drag', null)
              .on('end', null)
        );
      
      d3.selectAll('.checkerPiece[data-active=true]')
        .call(d3.drag()
              .on('start', this.dragstarted)
              .on('drag', this.drag)
              .on('end', this.dragended)
         );
     }
    
    render(){
      let active;
      
      if (this.props.gameState.whosTurn == 'player1'){
        this.props.color == 'red' ? active = true : active = false;
      }
      else {
        this.props.color == 'black' ? active = true : active = false;
      }
        
      
      return(
        <g data-id={this.props.id} className='checkerPiece' data-type={this.props.type} data-color={this.props.color} data-sqid={this.props.sqId} data-active={active}>
          <circle cx={this.props.sqCenterX} cy={this.props.sqCenterY} r='20' stroke={this.props.stroke} strokeWidth='3' fill={this.props.fillColor} />
          {this.props.type == 'king' ? <text data-piece-id={this.props.id}  x={this.props.sqCenterX - 5} y={this.props.sqCenterY + 5} fill="white">K</text> : ''}
  
        </g>
      )
    }
}

export default CheckerPiece;