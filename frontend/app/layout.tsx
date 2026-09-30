import './globals.css';
import { ReduxProvider } from '../app/store/Provider';

export const metadata = { title: 'WorkSync' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}