import React from 'react';
import * as d3 from 'd3';
import CheckerPiece from '../CheckerPiece/CheckerPiece.js';
import './Square.css';


class Square extends React.Component{
    componentDidUpdate() {
     // increase z-index of all checker pieces and text
     d3.selectAll('.checkerPiece').raise();
    }   
 
   render(){
     const sqCenterX = this.props.x + (this.props.width / 2);
     const sqCenterY = this.props.y + (this.props.height / 2);
     let sqContent = '';
     
     if (this.props.sqPiece.color == "black")
       sqContent = <CheckerPiece id={this.props.sqPiece.id} sqId={this.props.id} sqCenterX={sqCenterX} sqCenterY={sqCenterY} fillColor='steelblue' stroke='cadetblue' gameState={this.props.gameState} color={this.props.sqPiece.color} type={this.props.sqPiece.type} updateGame={this.props.updateGame} canMoveTo={this.props.canMoveTo}/>;
     else if (this.props.sqPiece.color == "red")
       sqContent = <CheckerPiece id={this.props.sqPiece.id} sqId={this.props.id} sqCenterX={sqCenterX} sqCenterY={sqCenterY} fillColor='#ff3333' stroke='brown' gameState={this.props.gameState} color={this.props.sqPiece.color} type={this.props.sqPiece.type} updateGame={this.props.updateGame} canMoveTo={this.props.canMoveTo}/>;
     
     return(
       <>
         <rect 
           data-id={this.props.id} 
           className={'rect ' + this.props.colorClass} 
           width={this.props.width} 
           height={this.props.height} 
           x={this.props.x} 
           y={this.props.y} 
           data-centerx={sqCenterX} 
           data-centery={sqCenterY} 
           data-piece={this.props.sqPiece} 
           data-pieceid={this.props.sqPiece.id} 
           data-color={this.props.colorClass} 
           data-piececolor={this.props.sqPiece.color} 
           data-row={this.props.gameState.board.squares[this.props.id -1].row} 
           data-col={this.props.gameState.board.squares[this.props.id -1].col} 
           data-isempty={this.props.isEmpty} 
         />
         {sqContent}
       </>
     )
   }
}
 
export default Square;