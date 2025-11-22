import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    nav: {
      logo: string;
      bg: string;
    };
    comment: {
      bg: string;
      border: string;
      borderHover: string;
      borderFocus: string;
      text: string;
    };
  }
  interface PaletteOptions {
    nav?: {
      logo: string;
      bg: string;
    };
    comment?: {
      bg: string;
      border: string;
      borderHover: string;
      borderFocus: string;
      text: string;
    };
  }
}