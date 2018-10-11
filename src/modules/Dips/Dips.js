import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import DipForm from './DipForm.cont'
import DipOverShort from './DipOverShort'
import DipSelectors from './DipSelectors.cont'
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
          delivery:   '',
          level:      '',
          litres:     null,
          prevLevel:  '',
          tank:       t,
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

  componentDidUpdate = prevProps => {
    if (!prevProps.dips) return
    if (!prevProps.dips.error && this.props.dips.error) {
      const errMsg = this.props.dips.error.message
      const ts = moment.utc().format()
      const msg = `${errMsg} -- ${ts}`
      this.props.actions.errorSend({message: msg, type: 'danger'})
    }
  }

  render() {

    const {
      classes,
      dips,
      fuelSaleLatest,
      history,
      match: { params },
      tanks,
    } = this.props

    const requestDate = params.date
    const dateObj = moment(requestDate)
    let havePrevDayDips = false
    let editMode = false
    let haveCurDips = false
    let haveFSImport = true

    let fsDate = ''
    if (fuelSaleLatest && fuelSaleLatest.fuelSaleLatest) {
      fsDate = moment(fuelSaleLatest.fuelSaleLatest.date.toString())
      // lastFSDate = fsDate.format('MMM DD, YYYY')
    }

    if (dips && dips.error) {
      haveCurDips = false
    }

    // Compare last imported with current date
    if (dateObj.isAfter(fsDate)) {
      haveFSImport = false
    }

    let waitComponent
    if (!params.stationID) {
      waitComponent = <div>Select a Station</div>
    } else {
      waitComponent = <Loader />
    }

    if (dips && dips.loading === false && dips.dipOverShortRange && !dips.error) {
      haveCurDips = true
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
              variant="h5"
          >Dip Entries</Typography>
          <Divider /><br />
          <div className={classes.secondaryContainer}>
            <DipSelectors />

            {!haveFSImport &&
              <div className={classes.lastFS}>
                <Button
                    className={classes.lastFSButton}
                    color="secondary"
                    component={Link}
                    size="small"
                    to="/import-data"
                    variant="outlined"
                >
                  Import Data
                </Button>
                <br />Date of last Fuel Sale import: {fsDate.format('MMM DD, YYYY')}
              </div>
            }

            {haveCurDips && haveFSImport &&
              <div style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                <div style={{flex: 1}}>
                {tanks && tanks.stationTanks && tanks.loading === false && dips && dips.loading === false ? (
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
                {dips &&
                  <DipOverShort
                      dateObj={dateObj}
                      dips={dips}
                  />
                }
                </div>
              </div>
            }
          </div>
        </Paper>
      </div>
    )
  }
}

Dips.propTypes = {
  actions:        PropTypes.object.isRequired,
  classes:        PropTypes.object.isRequired,
  data:           PropTypes.object,
  dips:           PropTypes.object,
  fuelSaleLatest: PropTypes.object,
  history:        PropTypes.object.isRequired,
  location:       PropTypes.object.isRequired,
  match:          PropTypes.object.isRequired,
  tanks:          PropTypes.object,
}

const styles =  theme => ({
  container: {
    fontFamily: theme.typography.fontFamily,
    minHeight:  600,
    margin:     theme.spacing.unit * 2,
    padding:    theme.spacing.unit * 2,
  },
  lastFS: {
    color:      theme.palette.secondary.main,
    marginTop:  theme.spacing.unit,
    fontSize:   14,
  },
  lastFSButton: {
    marginBottom: theme.spacing.unit,
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
