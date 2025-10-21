import { useState } from "react";
import InfiniteDragDropGrid from "./components/InfiniteDragDropGrid";
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
      <InfiniteDragDropGrid
        groupByKey={"list"}
        fetchItems={fetchItems}
        renderItem={(item) => <div>{item.id}</div>}
      />
    </>
  );
}

export default App;
