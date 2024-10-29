import { ReactNode } from 'react';
import { Karla } from 'next/font/google';
import { Header } from '../components/index'
import './global.css';

interface Props {
  children: ReactNode;
}

const inter = Karla({ subsets: ['latin'] });

const Layout = ({ children }: Props) => {
  return (
    <html lang='en'>
      <body className={inter.className + " bg-white bg-gradient-to-tr from-green-900/35 to-white bg-opacity-10"}>
        <Header />
        { children }
      </body>
    </html>
  );
};

export default Layout;