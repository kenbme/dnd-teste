import React from "react";
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

const DefaultGrid = ({ items, notifyUpdate }) => {
  return <DragDropGrid items={items} notifyUpdate={notifyUpdate} />;
};

const defaultFetchItems = () => {
  return [];
};

const defaultUpdateItem = async () => {};

export default function InfiniteGrid({
  fetchItems = defaultFetchItems,
  updateItem = defaultUpdateItem,
  Container = DefaultContainer,
  Grid = DefaultGrid,
  Loading = DefaultLoading,
  NotHasMore = DefaultNotHasMore,
}) {
  const { containerRef, items, setItems, loading, hasMore, notifyUpdate } =
    useInfiniteScroll(fetchItems, updateItem);

  return (
    <Container ref={containerRef}>
      <Grid items={items} notifyUpdate={notifyUpdate} />
      <div id="scroll-sentinel" style={{ height: "1px" }} />
      {loading && <Loading />}
      {!hasMore && items.length > 0 && <NotHasMore />}
    </Container>
  );
}
