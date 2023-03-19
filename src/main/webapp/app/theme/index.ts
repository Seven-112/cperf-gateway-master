import { createMuiTheme, colors } from '@material-ui/core';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.lightBlue[900],
    },
    secondary: {
      main: colors.pink[600],
    },
    text: {
      primary: colors.blueGrey[900],
      secondary: colors.blueGrey[600],
    },
  },
  typography,
});

export default theme;
