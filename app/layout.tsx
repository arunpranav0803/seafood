import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seafood Marketplace',
  description: 'Fresh ocean seafood ordering platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
