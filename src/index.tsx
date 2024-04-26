import App from "@components/App";
import { createRoot } from "react-dom/client";
import "@src/i18n";
import { GameProvider } from "./context/GameProvider";
import { StrictMode } from "react";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <StrictMode>
    <GameProvider>
        <App />
    </GameProvider>
    </StrictMode>
);
