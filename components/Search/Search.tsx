import { useState } from "react";
import classes from "./search.module.css";

export default function Search({ updateSearch }) {
  const [search, setSearch] = useState("");

  return (
    <div className={classes.search}>
      <div className={classes.search_container}>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateSearch(e.target.value);
          }}
          placeholder="Buscar productos..."
        />
      </div>
    </div>
  );
}
