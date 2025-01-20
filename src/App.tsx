import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import Trash from "./Components/Trash";
import { useEffect } from "react";


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards= styled.div`
   display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;







function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  useEffect(() => {
    if (localStorage.getItem("allBoards")) {
      setToDos(() => {
        return JSON.parse(localStorage.getItem("allBoards") || "");
      });
    }
  }, []);

  

  const onDragEnd = (info: DropResult) => {
    const { destination, source } = info;
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        const newAllBoards = {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
        localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
        return newAllBoards;
      });
    }

    if (destination?.droppableId === "trash") {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        const newAllBoards = {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
        localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
        return newAllBoards;
      });

    } else if (destination?.droppableId !== source.droppableId) {
      if (!destination) return;
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination?.droppableId]];
        const sourceObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, sourceObj);
        const newAllBoards = {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination?.droppableId]: destinationBoard,
        };
        localStorage.setItem("allBoards", JSON.stringify(newAllBoards));
        return newAllBoards;
      });
    }
  };
  return <DragDropContext onDragEnd={onDragEnd}>
    <Wrapper>
      <Boards>
        {Object.keys(toDos).map(boardId => <Board boardId={boardId} key={boardId} toDos={toDos[boardId]}></Board>)}
      </Boards>
      <Trash />
    </Wrapper>
  </DragDropContext>;

}

export default App;
