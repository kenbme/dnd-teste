import React, { useState, memo } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const ItemContent = memo(
  ({ item }) => {
    console.log("Render item", item.id);
    return <span>{item.id}</span>;
  },
  (prev, next) => prev.item.id === next.item.id,
);

const SortableItem = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <ItemContent item={item} />
    </div>
  );
};

export default function DragDropGrid() {
  const [items, setItems] = useState([
    { id: 1, list: "lista1" },
    { id: 2, list: "lista1" },
    { id: 3, list: "lista1" },
    { id: 7, list: "lista1" },
    { id: 8, list: "lista1" },
    { id: 9, list: "lista1" },
    { id: 10, list: "lista1" },
    { id: 4, list: "lista2" },
    { id: 5, list: "lista2" },
    { id: 6, list: "lista2" },
    { id: 11, list: "lista2" },
    { id: 12, list: "lista2" },
    { id: 13, list: "lista2" },
    { id: 14, list: "lista2" },
  ]);

  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    setItems((prevItems) => {
      const oldIndex = prevItems.findIndex((i) => i.id === active.id);
      if (oldIndex === -1) return prevItems;

      const updated = [...prevItems];
      const moving = {
        ...updated[oldIndex],
        list: prevItems.find((i) => i.id === over.id).list,
      };

      // remove do antigo
      updated.splice(oldIndex, 1);

      // adiciona ao final da lista de destino
      const destinationList = updated.filter((i) => i.list === moving.list);
      const lastIndex = updated.lastIndexOf(
        destinationList[destinationList.length - 1],
      );
      updated.splice(lastIndex + 1, 0, moving);

      return updated;
    });

    setActiveId(null);
  };

  const addItem = (list) => {
    setItems((prev) => {
      const maxId = Math.max(...prev.map((i) => i.id));
      const newItem = { id: maxId + 1, list };
      return [...prev, newItem];
    });
  };

  // Agrupa itens para exibição
  const grouped = items.reduce((acc, item) => {
    if (!acc[item.list]) acc[item.list] = [];
    acc[item.list].push(item);
    return acc;
  }, {});

  return (
    <>
      <button onClick={() => addItem("lista1")}>+ Item lista1</button>
      <button onClick={() => addItem("lista2")}>+ Item lista2</button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          {Object.keys(grouped).map((listId) => (
            <SortableContext
              key={listId}
              items={grouped[listId].map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div
                style={{
                  minWidth: "100px",
                  padding: "8px",
                  border: "1px solid #aaa",
                  borderRadius: "4px",
                }}
              >
                <h4>{listId}</h4>
                {grouped[listId].map((item) => (
                  <SortableItem key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeId && (
            <SortableItem item={items.find((i) => i.id === activeId)} />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}
