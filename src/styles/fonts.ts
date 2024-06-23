import { Inter } from 'next/font/google';

// TODO: after this https://github.com/vercel/next.js/pull/53608 we can use this and set a css variable,
// Currently it fails hydration, since the name is hashed

// import localFont from 'next/font/local'

// export const favorit = localFont({
//   variable: '--font-favorit',
//   src: [
//     {
//       path: './favorit/Regular.woff2',
//       weight: '400',
//       style: 'normal'
//     },
//     {
//       path: './favorit/Medium.woff2',
//       weight: '600',
//       style: 'normal'
//     },
//     {
//       path: './favorit/Bold.woff2',
//       weight: '800',
//       style: 'normal'
//     },
//     {
//       path: './favorit/RegularItalic.woff2',
//       weight: '400',
//       style: 'italic'
//     },
//     {
//       path: './favorit/MediumItalic.woff2',
//       weight: '600',
//       style: 'italic'
//     },
//     {
//       path: './favorit/BoldItalic.woff2',
//       weight: '800',
//       style: 'italic'
//     }
//   ]
// })

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
