import { useState } from "react";
import InfiniteGrid from "./components/InfiniteGrid";
import "./App.css";

const API_DELAY = 200;

function App() {
  const fetchItems = async (page) => {
    await new Promise((r) => setTimeout(r, API_DELAY));
    if (page == null) return [];
    if (page > 8) return [];

    const perPage = 50;
    const listas = ["lista1", "lista2", "lista3", "lista4", "lista5"];

    const newItems = Array.from({ length: perPage }, () => ({
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      list: listas[Math.floor(Math.random() * listas.length)], // distribui aleatoriamente entre 5 listas
    }));

    return newItems;
  };

  const updateItem = async (id, changes) => {
    await new Promise((r) => setTimeout(r, API_DELAY));
  };

  return (
    <>
      <InfiniteGrid fetchItems={fetchItems} />
    </>
  );
}

export default App;
