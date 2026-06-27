import "./globals.css";

export const metadata = {
  title: "Kadiri's House",
  description: "Professional Floor Plan Visualization",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
