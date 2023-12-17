import { React, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

export default function App() {
  const [items, setItems] = useState([]);

  function addItem(inputText) {
    setItems(prevItems => {
      return [...prevItems, inputText];
    });
  }

  function deleteItem(itemId) {
    setItems(prevItems => {
      return prevItems.filter((item, index) => {
        return index !== itemId;
      });
    });
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addItem} />
      {items.map((item, index) => (<Note id={index} key={index} title={item.title} content={item.content} onDelete={deleteItem} />))}
      <Footer />
    </div>
  );
}
