import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Crimson_Text } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const crimsonText = Crimson_Text({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ScholarFlow - Academic Productivity Platform',
    template: '%s | ScholarFlow',
  },
  description:
    'Create sophisticated academic websites with progressive complexity. Track productivity, manage your academic legacy, and network with scholars worldwide.',
  keywords: [
    'academic website',
    'research profile',
    'ORCID integration',
    'publication tracking',
    'academic networking',
    'research productivity',
  ],
  authors: [{ name: 'ScholarFlow Team' }],
  creator: 'ScholarFlow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://scholarflow.com',
    title: 'ScholarFlow - Academic Productivity Platform',
    description:
      'Create sophisticated academic websites with progressive complexity.',
    siteName: 'ScholarFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScholarFlow - Academic Productivity Platform',
    description:
      'Create sophisticated academic websites with progressive complexity.',
    creator: '@scholarflow',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${crimsonText.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}