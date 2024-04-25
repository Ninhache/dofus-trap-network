import App from "@components/App";
import { createRoot } from "react-dom/client";
import "@src/i18n";
import { GameProvider } from "./context/GameProvider";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<GameProvider><App /></GameProvider>);
