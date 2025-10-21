import React, { useState, useEffect, useRef, useCallback } from "react";
import DragDropGrid from "./DragDropGrid";

export default function InfiniteScrollGrid({
  groupByKey,
  fetchItems,
  renderItem,
  renderLoading,
  renderNotHasMore,
}) {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  const loadMoreItems = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchItems(page);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...newItems]);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Erro ao carregar itens:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchItems]);

  useEffect(() => {
    loadMoreItems();
  }, []);

  // Observador para detectar quando chegar no final
  useEffect(() => {
    if (!containerRef.current || !hasMore) return;

    const options = {
      root: containerRef.current,
      rootMargin: "100px", // Dispara quando estiver a 100px do final
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadMoreItems();
      }
    }, options);

    const sentinel = document.getElementById("scroll-sentinel");
    observer.observe(sentinel);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMoreItems]);

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
