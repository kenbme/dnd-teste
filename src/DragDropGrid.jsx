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
import { groupBy } from "./utils.js";

const ItemContent = memo(
  ({ item, renderItem }) => {
    console.log("Render item", item.id);
    return renderItem(item);
  },
  (prev, next) => prev.item.id === next.item.id,
);

const SortableItem = ({ item, renderItem }) => {
  const { attributes, listeners, setNodeRef } = useSortable({ id: item.id });

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <ItemContent item={item} renderItem={renderItem} />
    </div>
  );
};

export default function DragDropGrid({
  items,
  groupByFn,
  updateItem,
  renderItem,
}) {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const targetList = items.find((i) => i.id === over.id)?.list;
    if (!targetList) return;

    updateItem(active.id, { list: targetList });
    setActiveId(null);
  };

  const grouped = groupBy(items, groupByFn);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "flex", gap: "16px" }}>
          {Object.keys(grouped).map((groupKey) => (
            <SortableContext
              key={groupKey}
              items={grouped[groupKey].map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div>
                <h4>{groupKey}</h4>
                {grouped[groupKey].map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    renderItem={renderItem}
                  />
                ))}
              </div>
            </SortableContext>
          ))}
        </div>

        <DragOverlay>
          {activeId && (
            <SortableItem
              item={items.find((i) => i.id === activeId)}
              renderItem={renderItem}
            />
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
}
