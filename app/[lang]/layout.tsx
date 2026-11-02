import { RootProvider } from 'fumadocs-ui/provider/next';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { Instrument_Sans, Instrument_Serif, Geist_Mono } from 'next/font/google';
import '../global.css';
import { translations } from '@/lib/layout.shared';
import { i18n } from '@/lib/i18n';

const sans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans', weight: ['400', '500', '600', '700'] });
const serif = Instrument_Serif({ subsets: ['latin'], variable: '--font-serif', weight: '400' });
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default async function Layout({ params, children }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  return (
    <html lang={lang} className={`${sans.variable} ${serif.variable} ${mono.variable} dark`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider i18n={i18nProvider(translations, lang)} theme={{ enabled: false }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
