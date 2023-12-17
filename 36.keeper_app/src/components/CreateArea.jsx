import { React, useState } from "react";

export default function CreateArea(props) {
  const [input, setInput] = useState({
    title: "",
    content: ""
  });
  const [isExpanded, setExpanded] = useState(false);
  
  function handleChange(event) {
    const {value, name} = event.target;

    setInput(prevInput => {
      console.log(prevInput, name, value)
      return {
        ...prevInput,
        [name]: value
      }
    });
  }

  function handleSubmit(event) {
    props.onAdd(input);
    setInput({
      title: "",
      content: ""
    });
    event.preventDefault();
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div>
      <form className="create-note" onSubmit={handleSubmit}>
        {isExpanded &&
        <input name="title" placeholder="Title" onChange={handleChange} value={input.title} />
        }
        <textarea 
          name="content" 
          placeholder="Take a note..." 
          rows={isExpanded ? 3 : 1} 
          onChange={handleChange} 
          onClick={expand} 
          value={input.content} 
        />
        {isExpanded && <button>Add</button>}
      </form>
    </div>
  );
}
