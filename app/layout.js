export const metadata = {
  title: "Pay Terminal",
  description: "Stripe Terminal frontend"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
