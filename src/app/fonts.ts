import { Bitcount, Roboto } from 'next/font/google' 

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-roboto',
})

export const bitcount = Bitcount({
  subsets: ['latin'],
  weight: ['100'], 
  style: ['normal'],
  variable: '--font-bitcount',
})