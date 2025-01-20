import { Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";
import React from "react";


const Card = styled.div<{$isDragging: boolean}>`
  padding:10px 10px;
  display:flex;
  justify-content:space-between;
  margin-bottom:5px;
  border-radius:5px;
  background-color: ${props => props.$isDragging ? "#CCCCFF" : props.theme.cardColor};
  box-shadow: ${props => props.$isDragging ? "0px 2px 5px rgba(0,0,0,0.4)" : "none"};
`;

interface IDragabbleCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
}

function DraggableCard({toDoId, toDoText, index}: IDragabbleCardProps) {
   
  
   
  


    return (
        <Draggable draggableId={toDoId + ""} index={index}>
              {(magic, snapshot) => <Card 
              $isDragging={snapshot.isDragging}
              ref={magic.innerRef} 
              {...magic.draggableProps}
              {...magic.dragHandleProps}>
              
              {toDoText} <div>

            
              </div></Card>}
            </Draggable>
    )
}


export default React.memo(DraggableCard);