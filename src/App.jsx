import { useState } from "react";
import InfiniteScrollGrid from "./components/InfiniteScrollGrid";
import "./App.css";

function App() {
  const fetchItems = async (page) => {
    await new Promise((r) => setTimeout(r, 1000));
    if (page == null) return [];
    if (page > 3) return [];

    const perPage = 50;
    const newItems = Array.from({ length: perPage }, () => ({
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      list: Math.random() > 0.5 ? "lista1" : "lista2", // distribui aleatoriamente
    }));
    return newItems;
  };

  return (
    <>
      <InfiniteScrollGrid
        groupByKey={"list"}
        fetchItems={fetchItems}
        renderItem={(item) => <div>{item.id}</div>}
        renderLoading={() => (
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
        )}
        renderNotHasMore={() => (
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
        )}
      />
    </>
  );
}

export default App;
