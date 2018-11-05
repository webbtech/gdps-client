export const styles = theme => ({
  /* dashBut: {
    margin: 2,
  }, */
  /* root: {
    flexGrow: 1,
  }, */
  root: {
    display: 'flex',
  },
  flex: {
    flex: 1,
  },
  mainContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: 'auto',
  },
  titleLink: {
    textDecoration: 'none',
    color: '#fff',
  },
  paper: {
    minHeight: 600,
    // minWidth: 275,
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
  },
  popperClose: {
    pointerEvents: 'none',
    zIndex: -1,
  },
})
