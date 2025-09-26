import '@mui/material/styles';

declare module '@mui/material/styles' {
    
  interface Palette {
    nav: {
      logo: string;
      bg: string;
    };
  }

  interface PaletteOptions {
    nav?: {
      logo?: string;
      bg?: string;
    };
  }
}