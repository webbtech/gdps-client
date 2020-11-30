import React from 'react'
import PropTypes from 'prop-types'

import { Route } from 'react-router'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { styles as ms } from '../../styles/main'
import AdminMenu from './AdminMenu'
import Header from '../Header/Header'
import StationTanks from './StationTanks.cntr'
import TankAdmin from './TankAdmin'
import TankForm from './TankForm.cntr'


function Admin({ classes, match }) {
  return (
    <div>
      <Header />
      <Paper className={classes.paper}>
        <Typography
          gutterBottom
          variant="h5"
        >Administration
        </Typography>
        <AdminMenu />
        <Divider /><br />
        <div>
          <Route
            component={StationTanks}
            exact
            path={`${match.url}/station-admin`}
          />
          <Route
            component={StationTanks}
            path={`${match.url}/station-admin/:stationID`}
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

Admin.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
}

export default withStyles(ms)(Admin)
