import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import Demo1 from "./demo1";
import { useRef, useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  useDroppable,
  MouseSensor,
  Translate,
  useDraggable,
} from "@dnd-kit/core";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";

interface DraggableItemProps {
  label?: string;
  handle?: boolean;
  translate?: Translate;
}

// function DraggableItem({ axis, label }: DraggableItemProps) {
//   const { setNodeRef, listeners, isDragging } = useDraggable({
//     id: "draggable-item",
//   });

//   return (
//     <Draggable
//       ref={setNodeRef}
//       label={label}
//       axis={axis}
//       dragging={isDragging}
//       listeners={listeners}
//       style={{
//         opacity: isDragging ? 0.5 : undefined,
//       }}
//     />
//   );
// }
function DraggableItem({ handle }: any) {
  const { isDragging, setNodeRef, listeners } = useDraggable({
    id: "draggable-item",
  });

  return (
    <Draggable
      dragging={isDragging}
      ref={setNodeRef}
      handle={handle}
      listeners={listeners}
      style={
        {
          // opacity: isDragging ? 0 : undefined,
        }
      }
    />
  );
}

function App() {
  const constraintsRef = useRef(null);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const mouseSensor = useSensor(MouseSensor);

  const { setNodeRef } = useDroppable({
    id: "droppable",
    data: {
      accepts: ["type1", "type2"],
    },
  });

  const sensors = useSensors(mouseSensor);
  const [isDragging, setIsDragging] = useState(false);
  const [parent, setParent] = useState<any>(null);

  return (
    <motion.div className="flex w-full" layout ref={constraintsRef}>
      <DndContext
        sensors={sensors}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={({ over }) => {
          setParent(over ? over.id : null);
          setIsDragging(false);
        }}
      >
        <div className="w-[354px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <Droppable key={i} id={i} dragging={isDragging}>
              {parent === i ? i : null}
            </Droppable>
          ))}
        </div>
        <div className="flex w-full gap-3 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <DraggableItem key={i} />
            // <motion.div
            //   className="w-14 h-[384px] bg-blue-500 rounded-2xl flex-1 "
            //   initial={{ opacity: 0, scale: 0.5 }}
            //   animate={{ opacity: 1, scale: 1, x, y }}
            //   transition={{ duration: 0.5 }}
            //   whileTap={{ scale: 0.9 }}
            // />
          ))}
        </div>
      </DndContext>
    </motion.div>
  );
}

export default App;
