import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

class AdminMenu extends Component {

  setButtonColor(pathname, searchPath) {
    return (pathname.indexOf(searchPath) >= 0) ? 'primary' : 'default'
  }

  render() {

    const { classes } = this.props
    const { pathname } = this.props.history.location

    return (
      <div className={classes.menu}>
        <Button
            color={this.setButtonColor(pathname, '/admin/station-admin')}
            component={Link}
            to="/admin/station-admin"
        >
          Stations
        </Button>
        <Button
            color={this.setButtonColor(pathname, '/admin/tank-admin')}
            component={Link}
            to="/admin/tank-admin"
        >
          Tanks
        </Button>
      </div>
    )
  }
}
AdminMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

const styles =  theme => ({
  menu: {
    display:        'flex',
    flexDirection:  'row',
    // fontFamily:     theme.typography.fontFamily,
  },
})

export default withRouter(withStyles(styles)(AdminMenu))
