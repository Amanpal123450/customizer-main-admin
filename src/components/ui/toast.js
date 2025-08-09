// src/components/ui/toast.js
// Centralized toast utility for the entire app
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export const toast = {
  success: (text) => {
    Toastify({
      text,
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      backgroundColor: "#4BB543",
    }).showToast();
  },
  error: (text) => {
    Toastify({
      text,
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      backgroundColor: "#FF3E3E",
    }).showToast();
  },
  info: (text) => {
    Toastify({
      text,
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      backgroundColor: "#3498db",
    }).showToast();
  },
  alert: (text) => {
    // For alert, you can use a different color or style
    Toastify({
      text,
      duration: 3000,
      gravity: "top",
      position: "right",
      close: true,
      backgroundColor: "#f59e42",
    }).showToast();
  },
};
