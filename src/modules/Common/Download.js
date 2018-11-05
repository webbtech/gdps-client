import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Close from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

class Download extends Component {
  handleCloseWindow = () => {
    window.close()
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <AppBar
          className={classes.appBar}
          color="secondary"
          position="static"
        >
          <Typography
            className={classes.title}
            gutterBottom
            onClick={this.handleCloseWindow}
            variant="h6"
          >Gales Dips - File Download
          </Typography>
        </AppBar>
        <div className={classes.container}>
          <Typography
            gutterBottom
            variant="h6"
          >File Download
          </Typography>
          <div className={classes.message}>
            Stand by your file is being prepared and will download shortly.
          </div>
          <Button
            className={classes.button}
            color="secondary"
            onClick={this.handleCloseWindow}
          >
            <Close className={classes.leftIcon} />
          Close Window
          </Button>
        </div>
      </div>
    )
  }
}
Download.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
}

const styles = theme => ({
  appBar: {
  },
  button: {
    width: 180,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    margin: 'auto',
    marginTop: theme.spacing.unit * 10,
    width: 500,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  message: {
    marginBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 2,
  },
  title: {
    color: '#fff',
    padding: theme.spacing.unit * 2,
    cursor: 'pointer',
  },
})

export default withStyles(styles)(Download)
