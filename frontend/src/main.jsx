import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import { Provider } from "./context/ContextProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Provider>
);
