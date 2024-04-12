import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";
import { Menu } from "@mui/icons-material";

interface DraggableContainerProps {
  id: string;
  children: React.ReactNode;
  showDragHandle: boolean;
}

export const DraggableItem: React.FC<DraggableContainerProps> = ({
  id,
  children,
  showDragHandle,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div ref={setNodeRef} style={style}>
      <Box
        display={"flex"}
        flexDirection={"row"}
        sx={{ width: "100%" }}
        alignItems={"center"}
      >
        {showDragHandle && <Menu {...listeners} {...attributes} />}
        {children}
      </Box>
    </div>
  );
};
