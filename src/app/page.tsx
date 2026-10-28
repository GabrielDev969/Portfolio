import type { Metadata } from 'next'
import { languageTags, localeStorageKey, locales } from '@/lib/i18n'
import { basePath } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Gabriel Santos, Full Stack Developer',
  robots: { index: false },
}

// Static export has no middleware: pick the locale in the browser, before paint.
// Saved choice first, then the browser's languages (pt* → pt, es* → es, otherwise en).
const redirectScript = `(function(){try{var l=localStorage.getItem(${JSON.stringify(localeStorageKey)});}catch(e){}
var s=${JSON.stringify(locales)};if(s.indexOf(l)<0){l='en';var n=navigator.languages||[navigator.language||''];
for(var i=0;i<n.length;i++){var p=String(n[i]).toLowerCase().slice(0,2);if(p==='pt'||p==='es'||p==='en'){l=p;break;}}}
location.replace(${JSON.stringify(basePath)}+'/'+l+'/'+location.hash);})();`

const names = { pt: 'Português', en: 'English', es: 'Español' } as const

export default function RootRedirect() {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      </head>
      <body>
        <noscript>
          <ul>
            {locales.map((locale) => (
              <li key={locale}>
                <a href={`${basePath}/${locale}/`} hrefLang={languageTags[locale]}>
                  {names[locale]}
                </a>
              </li>
            ))}
          </ul>
        </noscript>
      </body>
    </html>
  )
}
