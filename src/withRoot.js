import React from 'react'
import { create } from 'jss'
import JssProvider from 'react-jss/lib/JssProvider'
import {
  MuiThemeProvider,
  createMuiTheme,
  createGenerateClassName,
  jssPreset,
} from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import grey from '@material-ui/core/colors/grey'
import CssBaseline from '@material-ui/core/CssBaseline'


const theme = createMuiTheme({
  palette: {
    primary: {
      light: red[300],
      main: red[600],
      dark: red[700],
    },
    secondary: {
      light: grey[300],
      main: grey[700],
      dark: grey[900],
    },
    error: red,
    // Used by `getContrastText()` to maximize the contrast between the background and
    // the text.
    contrastThreshold: 3,
    // Used to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
    typography: {
      fontFamily: 'Roboto',
      fontSize: 34,
    },
  },
})

// console.log('theme: ', theme.palette)

// Create a JSS instance with the default preset of plugins.
// It's optional.
const jss = create(jssPreset())

// The standard class name generator.
// It's optional.
const generateClassName = createGenerateClassName()

function withRoot(Component) {
  function WithRoot(props) {
    // JssProvider allows customizing the JSS styling solution.
    return (
      <JssProvider
          generateClassName={generateClassName}
          jss={jss}
      >
        {/* MuiThemeProvider makes the theme available down the React tree
          thanks to React context. */}
        <MuiThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...props} />
        </MuiThemeProvider>
      </JssProvider>
    )
  }

  return WithRoot
}

export default withRoot
