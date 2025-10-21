import React, { useState, useEffect, useRef, useCallback } from "react";
import DragDropGrid from "./DragDropGrid";
import useInfiniteScroll from "../hooks/useInfiniteScroll"

export default function InfiniteScrollGrid({
  groupByKey,
  fetchItems,
  renderItem,
  renderLoading,
  renderNotHasMore,
}) {
  const { containerRef, items, loading, hasMore } = useInfiniteScroll(fetchItems);

  return (
    <div
      ref={containerRef}
      style={{
        height: "80vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <DragDropGrid
        items={items}
        groupByKey={groupByKey}
        updateItem={(id, changes) =>
          setItems((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, ...changes } : item,
            ),
          )
        }
        renderItem={renderItem}
      />

      <div id="scroll-sentinel" style={{ height: "1px" }} />

      {loading && renderLoading()}

      {!hasMore && items.length > 0 && renderNotHasMore()}
    </div>
  );
}
