import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import moment from 'moment'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import DipForm from './DipForm'
import DipOverShort from './DipOverShort'
import DipSelectors from './DipSelectors'
import Header from '../Header/Header'
import { extractPathParts, datePrevDay, dateToInt } from '../../utils/utils'
import { styles as ms } from '../../styles/main'

import { errorSend } from '../Error/errorActions'


export const DIP_QUERY = gql`
  query Dips($date: Int!, $dateFrom: Int!, $dateTo: Int!, $stationID: String!) {
    curDips: dips(date: $date, stationID: $stationID) {
      date
      fuelType
      level
      litres
      stationTankID
      fuelDelivery {
        litres
      }
    }
    prevDips: dips(date: $dateFrom, stationID: $stationID) {
      date
      fuelType
      level
      litres
      stationTankID
    }
    fuelPrice(date: $date, stationID: $stationID) {
      date
      price
      stationID
    }
    dipOverShortRange(dateFrom: $dateFrom, dateTo: $dateTo, stationID: $stationID) {
      date
      overShort
      stationID
    }
    stationTanks(stationID: $stationID) {
      id
      fuelType
      tankID
      tank {
        levels
        size
      }
    }
  }
`


class Dips extends Component {

  state = {
    stationID: '',
    myData: '',
  }

  componentDidUpdate = (prevProps, prevState) => {
    // console.log('prevProps.match.params: ', prevProps.match.params)
    // console.log('prevState: ', prevState)
    let prevStationID = prevProps.match.params.stationID
    let curStationID = this.props.match.params.stationID
    if (prevStationID !== curStationID) {
      console.log('setting station id: ', curStationID)
      this.setState(() => ({stationID: curStationID, myData: 'good always'}))
    }
    /*if (prevProps.match.params.stationID) {
      // prevStationID = 
      console.log('prevStationID: ', prevProps.match.params.stationID)
    }
    if (this.props.match.params.stationID) {
      console.log('props stationID: ', this.props.match.params.stationID)
    }*/
  }

  render() {

    const { classes, data, history } = this.props
    const { pathname } = this.props.location

    const pathPrts = extractPathParts(pathname)
    const requestDate = pathPrts ? pathPrts[0] : null
    const dateObj = moment(requestDate)
    let havePrevDayDips = false
    let editMode = false

    if (data && data.error) {
      return <p>Data Error :(</p>
    }

    if (data && data.loading === false && data.dipOverShortRange) {
      const curDay = dateToInt(requestDate)
      const prevDay = datePrevDay(requestDate)
      if (data.dipOverShortRange[0].date === prevDay) {
        havePrevDayDips = true
      }
      if (data.dipOverShortRange[1] && data.dipOverShortRange[1].date === curDay) {
        editMode = true
      }
    }

    return (
      <div>
        <Header history={history} />
        <Paper className={classes.paper}>

          <Typography
              gutterBottom
              variant="headline"
          >Dip Entries</Typography>
          <Divider /><br />
          <div
              className={classes.mainContainer}
              style={{width: 1200}}
          >
            <DipSelectors />

            <div style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
              <div style={{flex: 1}}>
                <DipForm
                    data={data}
                    editMode={editMode}
                    havePrevDayDips={havePrevDayDips}
                />
              </div>
              <div style={{flex: .7}}>
                <DipOverShort
                    data={data}
                    dateObj={dateObj}
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
  history:  PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
}

// todo: check if we do or will need this
const mapDispatchToProps = dispatch => ({
  sendError: obj => dispatch(errorSend(obj)),
})

const DipsConnect = connect(
  null,
  mapDispatchToProps
)(withStyles(ms)(Dips))

export default graphql(DIP_QUERY, {
  skip: props => props.location.pathname.split('/').length <= 3,
  options: (props) => {
    const prts = extractPathParts(props.location.pathname)
    console.log('prts: ', prts)
    return ({
      variables: {
        date:       dateToInt(prts[0]),
        dateFrom:   datePrevDay(prts[0]),
        dateTo:     dateToInt(prts[0]),
        stationID:  prts[1],
      },
    })
  },
})(DipsConnect)
