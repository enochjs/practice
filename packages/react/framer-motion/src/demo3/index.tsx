import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import { useState } from "react";

function Droppable(props: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable",
  });
  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        width: "300px",
        height: "300px",
        border: "1px solid black",
      }}
    >
      {props.children}
    </div>
  );
}

function Draggable(props: any) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

export default function Demo3() {
  const [parent, setParent] = useState(null);
  function handleDragEnd({ over }: any) {
    console.log("over", over);
    setParent(over ? over.id : null);
  }
  return (
    <div>
      <DndContext onDragEnd={handleDragEnd}>
        <Droppable />
        <Draggable>test</Draggable>
      </DndContext>
    </div>
  );
}
