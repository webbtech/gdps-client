import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import DipForm from './DipForm'
import DipOverShort from './DipOverShort'
import DipSelectors from './DipSelectors'
import Header from '../Header/Header'
import Loader from '../Common/Loader'
import { datePrevDay, dateToInt } from '../../utils/utils'
import { FUEL_TYPE_LIST as fuelTypeList } from '../../config/constants'

const R = require('ramda')

const populateTanks = (dips, tanks) => {

  const { curDips, prevDips } = dips
  let tanksObj = {}

  fuelTypeList.forEach(ft => {
    tanks.forEach(t => {
      if (t.fuelType === ft) {
        const tmp = {
          level: '',
          prevLevel: '',
          litres: null,
          delivery: '',
          tank: t,
          dlError: false,
        }
        if (curDips) {
          tmp.dips = R.find(R.propEq('stationTankID', t.id))(curDips)
          tmp.level = tmp.dips.level
          tmp.litres = tmp.dips.litres
          if (tmp.dips.fuelDelivery) {
            tmp.delivery = tmp.dips.fuelDelivery.litres
          }
        }
        if (prevDips) {
          tmp.prevDips = R.find(R.propEq('stationTankID', t.id))(prevDips)
          tmp.prevLevel = tmp.prevDips.level
        }
        tanksObj[t.id] = tmp
      }
    })
  })

  return tanksObj
}

class Dips extends Component {

  render() {

    const { classes, dips, history, match: { params }, tanks } = this.props
    const requestDate = params.date
    const dateObj = moment(params.date)
    let havePrevDayDips = false
    let editMode = false

    if (dips && dips.error) {
      return <p>Data Error :(</p>
    }

    let waitComponent
    if (!params.stationID) {
      waitComponent = <div>Select a Station</div>
    } else {
      waitComponent = <Loader />
    }

    if (dips && dips.loading === false && dips.dipOverShortRange) {
      const curDay = dateToInt(requestDate)
      const prevDay = datePrevDay(requestDate)
      if (dips.dipOverShortRange[0].date === prevDay) {
        havePrevDayDips = true
      }
      if (dips.dipOverShortRange[1] && dips.dipOverShortRange[1].date === curDay) {
        editMode = true
      }
    }

    return (
      <div>
        <Header history={history} />
        <Paper className={classes.container}>

          <Typography
              gutterBottom
              variant="headline"
          >Dip Entries</Typography>
          <Divider /><br />
          <div className={classes.secondaryContainer}>
            <DipSelectors />

            <div style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
              <div style={{flex: 1}}>
              {tanks && tanks.stationTanks && dips && dips.loading === false ? (
                <DipForm
                    editMode={editMode}
                    havePrevDayDips={havePrevDayDips}
                    tankDips={populateTanks(dips, tanks.stationTanks)}
                />
              ) : (
                waitComponent
              )}
              </div>
              <div style={{flex: .7}}>
                <DipOverShort
                    dateObj={dateObj}
                    dips={dips}
                />
              </div>
            </div>
          </div>

        </Paper>
      </div>
    )
  }
}

Dips.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
  dips:     PropTypes.object,
  history:  PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
  tanks:    PropTypes.object,
}

const styles =  theme => ({
  container: {
    fontFamily: theme.typography.fontFamily,
    minHeight:  600,
    margin:     theme.spacing.unit * 2,
    padding:    theme.spacing.unit * 2,
  },
  secondaryContainer: {
    display:        'flex',
    flex:           1,
    flexDirection:  'column',
    margin:         'auto',
    width:          1200,
  },
})

export default withStyles(styles)(Dips)
