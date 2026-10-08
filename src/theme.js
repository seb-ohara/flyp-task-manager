import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#DFFF91', dark: '#C8E86C', light: '#EDFFC5', contrastText: '#111111' },
    secondary: { main: '#F75B26', dark: '#DB4718', light: '#FFF0E9', contrastText: '#FFFFFF' },
    info: { main: '#8DBAF4', dark: '#699FE8', light: '#E8F2FF', contrastText: '#111111' },
    background: { default: '#F4F4F6', paper: '#FFFFFF' },
    text: { primary: '#111111', secondary: '#62646A' },
    divider: '#E7E7EA',
    success: { main: '#719D22' },
    warning: { main: '#E87735' },
    error: { main: '#CB4D42' },
  },
  typography: {
    fontFamily: 'Lato, Arial, sans-serif',
    h1: { fontFamily: '"Roboto Slab", Georgia, serif', fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.035em', color: '#111111' },
    h2: { fontFamily: '"Roboto Slab", Georgia, serif', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#111111' },
    h3: { fontFamily: 'Lato, Arial, sans-serif', fontSize: '1.03rem', fontWeight: 800, letterSpacing: '-0.015em', color: '#111111' },
    button: { fontWeight: 700, textTransform: 'none', letterSpacing: 0 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 6, paddingInline: 15, minHeight: 38, boxShadow: 'none', fontWeight: 700 },
        containedPrimary: { color: '#111111', '&:hover': { backgroundColor: '#C8E86C', boxShadow: 'none' } },
        containedSecondary: { '&:hover': { backgroundColor: '#DB4718', boxShadow: 'none' } },
      },
    },
    MuiPaper: { styleOverrides: { rounded: { borderRadius: 8 }, outlined: { borderColor: '#E8E8EB' } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 6, backgroundColor: '#FFFFFF' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 5, fontWeight: 700 } } },
    MuiCheckbox: { styleOverrides: { root: { color: '#A3A4A8', '&.Mui-checked': { color: '#111111' } } } },
    MuiSwitch: { styleOverrides: { switchBase: { '&.Mui-checked': { color: '#111111' }, '&.Mui-checked + .MuiSwitch-track': { backgroundColor: '#C8E86C', opacity: 1 } }, track: { backgroundColor: '#CFD0D3', opacity: 1 } } },
  },
});

export default theme;
