import { useState } from "react";
import DragDropGrid from "./DragDropGrid";
import "./App.css";

function App() {
  const [items, setItems] = useState([
    { id: 1, list: "lista1" },
    { id: 2, list: "lista1" },
    { id: 3, list: "lista1" },
    { id: 7, list: "lista1" },
    { id: 8, list: "lista1" },
    { id: 9, list: "lista1" },
    { id: 10, list: "lista1" },
    { id: 4, list: "lista2" },
    { id: 5, list: "lista2" },
    { id: 6, list: "lista2" },
    { id: 11, list: "lista2" },
    { id: 12, list: "lista2" },
    { id: 13, list: "lista2" },
    { id: 14, list: "lista2" },
  ]);

  const updateItem = (id, changes) => {
    setItems((items) =>
      items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    );
  };

  return (
    <>
      <DragDropGrid
        items={items}
        updateItem={updateItem}
        renderItem={(item) => <div>{item.id}</div>}
        groupByFn={(item) => item.list}
      />
    </>
  );
}

export default App;
