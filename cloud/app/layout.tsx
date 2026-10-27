import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "3D CỦ CHI • Business OS",
  description: "Quản trị 3D Lab với dữ liệu lưu trên máy chủ.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="/style.css?v=cloud-1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
