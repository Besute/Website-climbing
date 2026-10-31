import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import { MetrikaCounter } from "react-metrika";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <MetrikaCounter
      id={111509561}
      options={{ trackHash: true, webvisor: true }}
    />
    <App />
  </BrowserRouter>,
);
