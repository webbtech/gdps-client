import React, { Component } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { Link } from 'react-router-dom'

import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import DipForm from './DipForm.cntr'
import DipOverShort from './DipOverShort'
import DipSelectors from './DipSelectors.cntr'
import Header from '../Header/Header'
import Loader from '../Common/Loader'
import { datePrevDay, dateToInt } from '../../utils/date'
import { FUEL_TYPE_LIST as fuelTypeList } from '../../config/constants'

const R = require('ramda')

const populateTanks = (dips, tanks) => {
  const { curDips, prevDips } = dips
  const tanksObj = {}

  fuelTypeList.forEach((ft) => {
    tanks.forEach((t) => {
      if (t.fuelType === ft) {
        const tmp = {
          delivery: '',
          level: '',
          litres: null,
          prevLevel: '',
          tank: t,
        }
        if (curDips) {
          tmp.dips = R.find(R.propEq('stationTankID', t.id))(curDips)
          if (tmp.dips) {
            tmp.level = tmp.dips.level
            tmp.litres = tmp.dips.litres
            if (tmp.dips.fuelDelivery) {
              tmp.delivery = tmp.dips.fuelDelivery.litres
            }
          }
        }
        if (prevDips) {
          tmp.prevDips = R.find(R.propEq('stationTankID', t.id))(prevDips)
          tmp.prevLevel = tmp.prevDips && tmp.prevDips.level
        }
        tanksObj[t.id] = tmp
      }
    })
  })

  return tanksObj
}

class Dips extends Component {
  constructor(props) {
    super(props)

    this.state = {
      submitting: false,
    }
    this.handleSubmitNotify = this.handleSubmitNotify.bind(this)
  }

  componentDidUpdate = (prevProps) => {
    if (!prevProps.dips) return
    if (!prevProps.dips.error && this.props.dips.error) {
      const errMsg = this.props.dips.error.message
      const ts = moment.utc().format()
      const msg = `${errMsg} -- ${ts}`
      this.props.actions.errorSend({ message: msg, type: 'danger' })
    }
  }

  handleSubmitNotify = (isSubmit) => {
    this.setState(() => ({ submitting: isSubmit }))
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
    let haveFSImport = true
    let loading = true

    let fsDate = ''
    if (fuelSaleLatest && fuelSaleLatest.fuelSaleLatest) {
      fsDate = moment(fuelSaleLatest.fuelSaleLatest.date.toString())
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

    if (dips && dips.networkStatus === 7
      && tanks && tanks.networkStatus === 7) {
      loading = false
    }

    if (dips && dips.dipOverShortRange) {
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
          >Dip Entries
          </Typography>
          <Divider /><br />
          <div className={classes.secondaryContainer}>
            <DipSelectors />

            {haveFSImport && loading && waitComponent}

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

            {haveFSImport && !loading &&
              <div style={{ display: 'flex', flexDirection: 'row', marginTop: 20 }}>
                <div style={{ flex: 1 }}>
                  <DipForm
                    editMode={editMode}
                    havePrevDayDips={havePrevDayDips}
                    isSubmit={this.state.submitting}
                    tankDips={populateTanks(dips, tanks.stationTanks)}
                    submitFunc={this.handleSubmitNotify}
                  />
                </div>
                <div style={{ flex: 0.7 }}>
                  <DipOverShort
                    dateObj={dateObj}
                    dips={dips}
                    isSubmit={this.state.submitting}
                  />
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
  actions: PropTypes.instanceOf(Object).isRequired,
  classes: PropTypes.instanceOf(Object).isRequired,
  dips: PropTypes.instanceOf(Object),
  fuelSaleLatest: PropTypes.instanceOf(Object),
  history: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
  tanks: PropTypes.instanceOf(Object),
}
Dips.defaultProps = {
  dips: null,
  fuelSaleLatest: null,
  tanks: null,
}

const styles = theme => ({
  container: {
    fontFamily: theme.typography.fontFamily,
    minHeight: 600,
    margin: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
  },
  lastFS: {
    color: theme.palette.secondary.main,
    marginTop: theme.spacing.unit,
    fontSize: 14,
  },
  lastFSButton: {
    marginBottom: theme.spacing.unit,
  },
  secondaryContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: 'auto',
    width: 1200,
  },
})

export default withStyles(styles)(Dips)
