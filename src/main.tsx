import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./styles/index.css";
import { MetrikaCounter } from "react-metrika";

// Рендерим приложение с Метрикой
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <MetrikaCounter 
      id={111509561} 
      options={{ trackHash: true, webvisor: true }} 
    />
    <App />
  </BrowserRouter>
);
