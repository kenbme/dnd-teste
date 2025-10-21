import { useState, memo } from "react";
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

const groupBy = (array, keyFn) => {
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

const ItemContent = memo(
  ({ item, renderItem }) => {
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

const DefaultGroupContainer = ({ groupKey, children }) => (
  <div>
    <h4>{groupKey}</h4>
    {children}
  </div>
);

const DefaultOuterContainer = ({ children }) => (
  <div style={{ display: "flex", gap: "16px" }}>{children}</div>
);

const defaultSortGroups = (keys) => {
  return keys.sort((a, b) => a.localeCompare(b));
};

const defaultGroupByKey = "list";

const defaultRenderItem = (item) => <div>{item.id}</div>;

const defaultItems = [];

const defaultRequestUpdate = () => {};

export default function DragDropGrid({
  items = defaultItems,
  requestUpdate = defaultRequestUpdate,
  groupByKey = defaultGroupByKey,
  renderItem = defaultRenderItem,
  sortGroups = defaultSortGroups,
  GroupContainer = DefaultGroupContainer,
  OuterContainer = DefaultOuterContainer,
}) {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(PointerSensor));
  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;

    const targetItem = items.find((i) => i.id === over.id);
    if (!targetItem) return;

    const targetGroup = targetItem[groupByKey];
    requestUpdate(active.id, { [groupByKey]: targetGroup });
    setActiveId(null);
  };

  const grouped = groupBy(items, (item) => item[groupByKey]);

  const orderedGroups = sortGroups(Object.keys(grouped)).map((key) => ({
    key,
    items: grouped[key],
  }));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <OuterContainer>
        {orderedGroups.map((group) => (
          <SortableContext
            key={group.key}
            items={group.items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <GroupContainer groupKey={group.key}>
              {group.items.map((item) => (
                <SortableItem
                  key={item.id}
                  item={item}
                  renderItem={renderItem}
                />
              ))}
            </GroupContainer>
          </SortableContext>
        ))}
      </OuterContainer>

      <DragOverlay dropAnimation={null}>
        {activeId && (
          <SortableItem
            item={items.find((i) => i.id === activeId)}
            renderItem={renderItem}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
