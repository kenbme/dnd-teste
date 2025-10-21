import { useState } from "react";
import InfiniteGrid from "./components/InfiniteGrid";
import "./App.css";

function App() {
  const fetchItems = async (page) => {
    await new Promise((r) => setTimeout(r, 1000));
    if (page == null) return [];
    if (page > 3) return [];

    const perPage = 1;
    const newItems = Array.from({ length: perPage }, () => ({
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      list: Math.random() > 0.5 ? "lista1" : "lista2", // distribui aleatoriamente
    }));
    return newItems;
  };

  const updateItem = async (id, changes) => {
    await new Promise((r) => setTimeout(r, 1000));
    console.log("oi");
    console.log(id, changes);
  };

  return (
    <>
      <InfiniteGrid
        groupByKey={"list"}
        fetchItems={fetchItems}
        renderItem={(item) => <div>{item.id}</div>}
        updateItem={updateItem}
      />
    </>
  );
}

export default App;
