import Providers from '../components/Providers';

export const metadata = {
  title: 'SIWE Hello World',
  description: 'Sign-In with Ethereum authentication demo on Oasis Sapphire',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 