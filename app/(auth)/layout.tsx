import { ReactNode } from 'react';
import { Karla } from 'next/font/google';
import { Header } from '@/components/index'
import '@/app/global.css';

interface Props {
  children: ReactNode;
}

const inter = Karla({ subsets: ['latin'] });

const Layout = ({ children }: Props) => {
  return (
    <html lang='en'>
      <body className={`${inter.className} relative`}>
        <Header />
        { children }
      </body>
    </html>
  );
};

export default Layout;