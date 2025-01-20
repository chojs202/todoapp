import { Droppable } from "@hello-pangea/dnd"
import DraggableCard from "./DragabbleCard";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { ITodo, toDoState } from "../atoms";
import { useSetRecoilState } from "recoil";




const Wrapper = styled.div`
    width:300px;
    height:400px;
    padding-top:10px;
    background-color: ${props => props.theme.boardColor};
    border-radius:5px;
    min-height:350px;
    display:flex;
    flex-direction: column;

`;
const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IAreaProps {
    $isDraggingFromThis:boolean;
    $isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color:${props => props.$isDraggingOver ? "#F2DADF" : props.$isDraggingFromThis ? "#DCD0FF" : "white"};
  flex-grow:1;
  transition: background-color .3s ease-in-out;
  padding: 20px;
`;

const Form = styled.form`
    width:100%;
    display: flex;
    justify-content: center;
    input {
        width:80%;
        margin-bottom:5px;
        border-radius:5px;
        border-color:white;

    }
`;

interface IBoardProps{
    toDos: ITodo[];
    boardId: string;
}

interface IForm {
    toDo: string;
}

function Board({toDos, boardId}:IBoardProps) {
    const {register, setValue, handleSubmit} = useForm<IForm>();
    const setToDos = useSetRecoilState(toDoState)
    const onValid = ({toDo}:IForm) => {
        if(toDo.trim() ===""){
            return;
        }
        const newToDo = {
            id: Date.now(),
            text: toDo,
        };
        setToDos(allBoards => {
            const newAllBoards = {
              ...allBoards,
              [boardId]: [...allBoards[boardId], newToDo],
            };
            localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
            return newAllBoards;
          });
        setValue("toDo", "");
    }
    

    return(
    <Wrapper>
    <Title>{boardId}</Title>
    <Form onSubmit={handleSubmit(onValid)}>
        <input {...register("toDo", { required: true})} type="text" placeholder={`Add ${boardId}`} />
    </Form>
    <Droppable droppableId={boardId}>
         {(magic, info)=> 
         <Area 
         $isDraggingOver={info.isDraggingOver} 
         $isDraggingFromThis={Boolean(info.draggingFromThisWith)} 
         ref={magic.innerRef} 
         {...magic.droppableProps}
         >
            {
                toDos.map((toDo, index) => (
                <DraggableCard 
                key={toDo.id} 
                index={index} 
                toDoId={toDo.id} 
                toDoText={toDo.text} 
                />
            ))
            }
            {magic.placeholder}
          </Area>
          } 
        </Droppable>

        </Wrapper>
        )
}


export default Board;