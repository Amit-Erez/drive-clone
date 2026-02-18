"use client";

import React from "react";
import { useToast } from "@/hooks/use-toast";

const ToastViewport = () => {
  const { toasts, dismiss, remove } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`relative p-4 rounded-lg shadow-lg text-white ${toast.className || "bg-black"}`}
          style={{ minWidth: 280, maxWidth: 400 }}
        >
          {toast.title && <div className="font-bold mb-1">{toast.title}</div>}
          <div>{toast.description}</div>
          <button
            className="absolute top-2 right-2 text-white/70 hover:text-white"
            onClick={() => remove(toast.id)}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastViewport;
