import React from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

function setButtonColor(pathname, searchPath) {
  return (pathname.indexOf(searchPath) >= 0) ? 'primary' : 'default'
}

function AdminMenu({ classes, history }) {
  const { pathname } = history.location

  return (
    <div className={classes.menu}>
      <Button
        color={setButtonColor(pathname, '/admin/station-admin')}
        component={Link}
        to="/admin/station-admin"
      >
        Stations
      </Button>
      <Button
        color={setButtonColor(pathname, '/admin/tank-')}
        component={Link}
        to="/admin/tank-admin"
      >
        Tanks
      </Button>
    </div>
  )
}
AdminMenu.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
}

const styles = () => ({
  menu: {
    display: 'flex',
    flexDirection: 'row',
  },
})

export default withRouter(withStyles(styles)(AdminMenu))
