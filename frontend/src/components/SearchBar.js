import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      navigate(`/vitrine?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex me-3">
      <input
        type="text"
        placeholder="Buscar produtos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="form-control me-2"
      />
      <button type="submit" className="btn btn-primary">Buscar</button>
    </form>
  );
}
