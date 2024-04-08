import {
  DndContext,
  useDroppable,
  useDraggable,
  UniqueIdentifier,
  DragOverlay,
  DropAnimation,
} from "@dnd-kit/core";
import classNames from "classnames";
import { useState } from "react";
import styles from "./index.module.css";

import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";

interface DropProps {
  children: React.ReactNode;
  dragging: boolean;
  id: UniqueIdentifier;
}
function Droppable({ children, id, dragging }: DropProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const style = {
    background: isOver ? "green" : undefined,
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
      {children}
    </div>
  );
}

function Draggable({ children, id, dragging }: DropProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <div
      className={classNames(
        styles.Draggable,
        // dragOverlay && styles.dragOverlay,
        dragging && styles.dragging,
        // handle && styles.handle,
      )}
    >
      <button
        ref={setNodeRef}
        style={{
          // ...style,
          border: "1px solid black",
          padding: "10px",
          margin: "10px",
          color: "white",
        }}
        {...listeners}
        {...attributes}
      >
        {children}
        <div className={styles.footer}></div>
      </button>
    </div>
  );
}

function Item(props: any) {
  return <div>{props.value}</div>;
}

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { transform: CSS.Transform.toString(transform.initial) },
      {
        transform: CSS.Transform.toString({
          ...transform.final,
          scaleX: 0.94,
          scaleY: 0.94,
        }),
      },
    ];
  },
  sideEffects({ active, dragOverlay }) {
    active.node.style.opacity = "0";

    const button = dragOverlay.node.querySelector("button");
    console.log("====button", button);

    if (button) {
      button.animate(
        [
          {
            boxShadow:
              "-1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)",
          },
          {
            boxShadow:
              "-1px 0 15px 0 rgba(34, 33, 81, 0), 0px 15px 15px 0 rgba(34, 33, 81, 0)",
          },
        ],
        {
          duration: 250,
          easing: "ease",
          fill: "forwards",
        },
      );
    }

    return () => {
      active.node.style.opacity = "";
    };
  },
};

export default function Demo3() {
  const [parent, setParent] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingId, setDraggingId] = useState<UniqueIdentifier>();
  const list = { hidden: { opacity: 0 } };
  const item = { hidden: { x: -10, opacity: 0 } };

  return (
    <div className="flex">
      <motion.ul animate="hidden" variants={list}>
        <motion.li variants={item} />
        <motion.li variants={item} />
        <motion.li variants={item} />
      </motion.ul>
      {/* <DndContext
        onDragStart={(e) => {
          setIsDragging(true);
          setDraggingId(e.active.id);
        }}
        onDragEnd={(data: any) => {
          setParent(data.over ? data.over.id : null);
          setIsDragging(false);
          setDraggingId(undefined);
        }}
        onDragCancel={() => setIsDragging(false)}
      >
        <div className={styles.dragImg}>
          <motion.img
            animate={{
              // scale: [0.8, 0.5],
              rotate: [0, 180],
            }}
            src="https://linkmore-scm-test.oss-cn-hangzhou.aliyuncs.com/BizFile/4595/Product/1694162925394-bc2fc29b2bbb513109a3bff9ba670ca2.jpg?x-oss-process=image/resize,w_260"
            className={`w-36 h-36 rounded-full `}
          />
        </div>

        <div>
          <Droppable id="1" dragging={isDragging}>
            {parent === "1" ? "dropped" : "drop 1"}
            drop 1
          </Droppable>
          <Droppable id="2" dragging={isDragging}>
            drop 2
          </Droppable>
          <Droppable id="3" dragging={isDragging}>
            drop 3
          </Droppable>
        </div>
        <div>
          <Draggable id="d1" dragging={draggingId === "d1"}>
            <Item value="drag 1" />
          </Draggable>
          <Draggable id="d2" dragging={draggingId === "d2"}>
            <Item value="drag 2" />
          </Draggable>
          <Draggable id="d3" dragging={draggingId === "d3"}>
            <Item value="drag 3" />
          </Draggable>
        </div>
        <DragOverlay dropAnimation={parent ? null : undefined}>
          {draggingId ? (
            <Draggable id="d3" dragging={draggingId === "d3"}>
              <div>
                <div>1</div>
                <div>2</div>
                <div>3</div>
                <div>4</div>
                <div>5</div>
              </div>
            </Draggable>
          ) : null}
        </DragOverlay>
      </DndContext> */}
    </div>
  );
}
