import React, { useState, useEffect, useRef, useCallback } from "react";
import DragDropGrid from "./DragDropGrid";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const DefaultContainer = React.forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{
      height: "80vh",
      overflowY: "auto",
      position: "relative",
    }}
    {...props}
  />
));

const DefaultLoading = () => (
  <div
    style={{
      textAlign: "center",
      padding: "20px",
      background: "#f0f0f0",
      color: "#666",
    }}
  >
    Carregando mais itens...
  </div>
);

const DefaultNotHasMore = () => (
  <div
    style={{
      textAlign: "center",
      padding: "20px",
      background: "#f0f0f0",
      color: "#666",
    }}
  >
    Não há mais itens para carregar
  </div>
);

const DefaultGrid = ({ items, updateItem }) => {
  return <DragDropGrid items={items} updateItem={updateItem} />;
};

const defaultFetchItems = () => {
  return [];
};

export default function InfiniteGrid({
  fetchItems = defaultFetchItems,
  container: Container = DefaultContainer,
  grid: Grid = DefaultGrid,
  renderLoading = DefaultLoading,
  renderNotHasMore = DefaultNotHasMore,
}) {
  const { containerRef, items, setItems, loading, hasMore } =
    useInfiniteScroll(fetchItems);

  const updateItem = async (id, changes) => {
    try {
      // chama a API primeiro
      if (updateItem) await updateItem(id, changes);

      // só atualiza o estado depois que a API retornar sucesso
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...changes } : item)),
      );
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
    }
  };

  const content = (
    <>
      <Grid items={items} updateItem={updateItem} />
      <div id="scroll-sentinel" style={{ height: "1px" }} />
      {loading && renderLoading()}
      {!hasMore && items.length > 0 && renderNotHasMore()}
    </>
  );

  return <Container ref={containerRef}>{content}</Container>;
}
