import { useState, useEffect, useRef } from "react";

export default function useInfiniteScroll(fetchItems, updateItem) {
  const containerRef = useRef(null);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef(null);

  const loadMoreItems = async () => {
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
    } catch (err) {
      console.error("Error loading items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreItems();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !hasMore) return;

    const options = {
      root: containerRef.current,
      rootMargin: "100px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadMoreItems();
      }
    }, options);

    let sentinel = document.getElementById("scroll-sentinel");
    if (!sentinel) {
      sentinel = document.createElement("div");
      sentinel.id = "scroll-sentinel";
      sentinel.style.height = "1px";
      containerRef.current.appendChild(sentinel);
    }
    observer.observe(sentinel);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading]);

  const requestUpdate = async (id, changes) => {
    try {
      if (updateItem) await updateItem(id, changes);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...changes } : item)),
      );
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  return { containerRef, items, setItems, loading, hasMore, requestUpdate };
}
