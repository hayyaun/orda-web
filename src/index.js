import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./pwa/reportWebVitals";
import * as serviceWorkerRegistration from "./pwa/serviceWorkerRegistration";

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty("--vh", `${vh}px`);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register({
  onUpdate: (e) => {
    const { waiting: { postMessage = null } = {}, update } = e || {};
    if (postMessage) {
      postMessage({ type: "SKIP_WAITING" });
    }
    update().then(() => {
      window.location.reload();
    });
  },
});

reportWebVitals();
