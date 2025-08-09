// src/components/ui/confirm.js
// Centralized confirm dialog utility (async/await style)
import React from "react";

export function confirmDialog(message) {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.innerHTML = `
      <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.3);z-index:9999;display:flex;align-items:center;justify-content:center;">
        <div style="background:white;padding:2rem 2.5rem;border-radius:12px;box-shadow:0 2px 16px #0002;min-width:300px;text-align:center;">
          <div style="font-size:1.1rem;margin-bottom:1.5rem;">${message}</div>
          <button id="confirm-yes" style="background:#2563eb;color:white;padding:0.5rem 1.5rem;border:none;border-radius:6px;margin-right:1rem;cursor:pointer;">Yes</button>
          <button id="confirm-no" style="background:#e5e7eb;color:#111;padding:0.5rem 1.5rem;border:none;border-radius:6px;cursor:pointer;">No</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#confirm-yes").onclick = () => {
      document.body.removeChild(modal);
      resolve(true);
    };
    modal.querySelector("#confirm-no").onclick = () => {
      document.body.removeChild(modal);
      resolve(false);
    };
  });
}
