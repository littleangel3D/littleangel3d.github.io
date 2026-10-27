"use client";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "/app.js?v=cloud-1";
    document.body.appendChild(script);
    return () => script.remove();
  }, []);
  return (
    <>
      <div id="app">
        <div style={{ padding: 40, fontFamily: "sans-serif" }}>
          Đang kết nối dữ liệu máy chủ…
        </div>
      </div>
      <div id="modal-root" />
      <div id="toast" role="status" />
    </>
  );
}
