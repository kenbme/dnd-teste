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
    Loading...
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
    No more items to load
  </div>
);

const DefaultGrid = ({ items, requestUpdate }) => {
  return <DragDropGrid items={items} requestUpdate={requestUpdate} />;
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
  const { containerRef, items, setItems, loading, hasMore, requestUpdate } =
    useInfiniteScroll(fetchItems, updateItem);

  return (
    <Container ref={containerRef}>
      <Grid items={items} requestUpdate={requestUpdate} />
      {loading && <Loading />}
      {!hasMore && items.length > 0 && <NotHasMore />}
    </Container>
  );
}
