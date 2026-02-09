import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '../context/ThemeContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: ['class', '[data-theme="dark"]'],
              theme: {
                extend: {
                  colors: {
                    dark: '#121212',
                    light: '#e0e0e0'
                  }
                }
              }
            }
          `
        }} />
      </Head>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}