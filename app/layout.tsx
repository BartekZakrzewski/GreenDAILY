import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import './global.css';

interface Props {
  children: ReactNode;
}

const inter = Inter({ subsets: ['latin'] });

const Layout = ({ children }: Props) => {
  return (
    <html lang='en'>
      <body className={inter.className}>
        { children }
      </body>
    </html>
  );
};

export default Layout;