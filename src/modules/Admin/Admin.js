import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Route } from 'react-router'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import AdminMenu from './AdminMenu'
import StationAdmin from './StationAdmin'
import TankAdmin from './TankAdmin'
import TankForm from './TankForm'
import Header from '../Header/Header'
// import AdminSelectors from './AdminSelectors'
// import StationInfo from './StationInfo'
import { styles as ms } from '../../styles/main'


class Admin extends Component {

  render() {

    const { classes, match } = this.props

    return (
      <div>
        <Header />
        <Paper className={classes.paper}>
          <Typography
              gutterBottom
              variant="headline"
          >Administration</Typography>
          <AdminMenu />
          <Divider /><br />
          <div>
            <Route
                component={StationAdmin}
                path={`${match.url}/station-admin`}
            />
            <Route
                component={TankAdmin}
                path={`${match.url}/tank-admin`}
            />
            <Route
                component={TankForm}
                exact
                path={`${match.url}/tank-form`}
            />
            <Route
                component={TankForm}
                path={`${match.url}/tank-form/:tankID`}
            />
          </div>
        </Paper>
      </div>
    )
  }
}

Admin.propTypes = {
  classes:  PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
}

export default withStyles(ms)(Admin)