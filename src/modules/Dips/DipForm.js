import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'
import { debounce } from 'lodash'

import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import Save from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import * as errorActions from '../Error/errorActions'
import Alert from '../Common/Alert'
import Toaster from '../Common/Toaster'
import { DIP_QUERY } from './Dips'
import { fmtNumber } from '../../utils/utils'
import { FUEL_TYPE_LIST as fuelTypeList } from '../../config/constants'

const R = require('ramda')

const CREATE_DIPS = gql`
mutation CreateDips($fields: [DipInput]) {
  createDips(input: $fields) {
    ok
    nModified
  }
}
`

class DipForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      haveErrors: false,
      tanks: null,
      toasterMsg: '',
    }
    this.createDipsVars = this.createDipsVars.bind(this)
    this.handleCalculateLitres = debounce(this.handleCalculateLitres, 400)
  }

  componentDidUpdate = prevProps => {

    let tanks = {}
    const { data } = this.props
    if (data !== prevProps.data && data.loading === false && data.stationTanks) {
      const { curDips, prevDips } = data
      fuelTypeList.forEach(ft => {

        data.stationTanks.forEach(t => {
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
            tanks[t.id] = tmp
          }
        })
      })

      this.setState(() => ({tanks}))
    }
  }

  // see: https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js for explanation on debounce
  handleChange = (e) => {
    e.persist()
    const inputId = e.target.id
    const val     = e.target.value
    const pcs     = inputId.split('_')
    const id      = pcs[0]
    const field   = pcs[1]

    // Using a tmp tank holder appeared to be the only way to set the state properly here
    let tanks = this.state.tanks
    const value = parseInt(val, 10) || ''
    tanks[id][field] = value
    this.setState(() => ({tanks, toasterMsg: ''}))

    if (field === 'level') {
      this.handleCalculateLitres(id, val)
    }
  }

  handleCalculateLitres = (tankID, val) => {

    // If user deletes value entirely, we need to zero out entry
    let tanks = this.state.tanks

    if (!val || val === '0') {
      tanks[tankID].level = 0
      tanks[tankID].litres = 0
      this.setState(() => ({tanks}))
      return
    }

    let inputLevel = parseInt(val, 10)
    if (inputLevel <= 1) return
    const levels = tanks[tankID].tank.tank.levels
    if (!levels[inputLevel]) {
      inputLevel++
    }

    tanks[tankID].level = inputLevel
    if (levels[inputLevel]) {
      tanks[tankID].litres = levels[inputLevel].litres
      this.setState(() => ({tanks}))
    }
  }

  handleDipComplete = () => {
    this.setState({toasterMsg: 'Dip entry successfully persisted'})
  }

  handleValidateTankLevel = (tankID, e) => {
    let { tanks } = this.state
    const field = e.target.name
    let changeVals = false

    if (field === 'level') {
      if (!tanks[tankID].delivery && (tanks[tankID].level > tanks[tankID].prevLevel)) {
        tanks[tankID].dlError = true
        changeVals = true
      } else if (tanks[tankID].level === '') {
        tanks[tankID].dlError = true
        changeVals = true
      } else {
        tanks[tankID].dlError = false
        changeVals = true
      }
    } else if (field === 'delivery') {
      if (tanks[tankID].delivery) {
        tanks[tankID].dlError = false
        changeVals = true
      }
    }
    if (changeVals) {
      if (tanks[tankID].dlError) {
        this.setState(() => ({tanks, haveErrors: true}))
      } else {
        this.setState(() => ({tanks}))
      }
    }
  }

  handleDipSumit = () => {
    const dipParams = this.createDipsVars()
    if (!dipParams) return false

    this.props.mutate({
      variables: dipParams,
      refetchQueries: [{query: DIP_QUERY, variables: this.fetchDipsVars()}],
    })
    .then(() => {
    // .then(({ data }) => {
      // console.log('got data', data)
      this.handleDipComplete()
    }).catch((error) => {
      const errMsg = `There was an error sending the query: ${error}`
      this.props.actions.errorSend({message: errMsg, type: 'danger'})
    })
  }

  createDipsVars = () => {
    const tanks = this.state.tanks
    let error = false
    let errMsgs = []
    for (const t in tanks) {
      if (tanks[t].dlError) {
        error = true
        errMsgs.push(`Invalid tank level for tank id: ${tanks[t].tank.tankID}`)
      }
    }
    if (error) {
      errMsgs.forEach(e => {
        this.props.actions.errorSend({message: e, type: 'danger'})
      })
      return null
    }

    // Extract station and date from the graphql data
    const { variables } = this.props.data
    let dips = []
    for (const stID in tanks) {
      dips.push({
        date:           variables.date,
        delivery:       tanks[stID].delivery || null,
        fuelType:       tanks[stID].tank.fuelType,
        level:          tanks[stID].level,
        litres:         tanks[stID].litres,
        stationID:      variables.stationID,
        stationTankID:  stID,
      })
    }

    return { fields: dips }
  }

  fetchDipsVars = () => {
    const { variables } = this.props.data
    return {
      date:       variables.date,
      dateFrom:   variables.dateFrom,
      dateTo:     variables.dateTo,
      stationID:  variables.stationID,
    }
  }

  renderTanks = (data, classes) => {

    const { tanks } = this.state
    if (!tanks) return null

    if (data.loading) return <p>Loading...</p>

    let rows = []
    for (const t in tanks) {
      rows.push({
        id:       t,
        fuelType: tanks[t].tank.fuelType,
        tankID:   tanks[t].tank.tankID,
        size:     tanks[t].tank.tank.size,
        dlError:  tanks[t].dlError,
      })
    }

    return rows.map((t, i) => (
      <div
          className={classNames(classes.dataRow, {[classes.dataRowError]: t.dlError})}
          key={t.id}
      >
        <div className={classes.dataCell}>
          {t.size} ({t.tankID})
          <span style={{display: 'inline', marginLeft: 15}}>{t.fuelType}</span>
        </div>
        <div className={classes.dataCell}>
          <Input
              autoFocus={i === 0}
              className={classes.input}
              id={`${t.id}_level`}
              name="level"
              onBlur={(e) => this.handleValidateTankLevel(t.id, e)}
              onChange={this.handleChange}
              type="number"
              value={tanks[t.id].level}
          />
        </div>
        <div className={classNames([classes.dataCell], [classes.dataAlignRight])}>{fmtNumber(tanks[t.id].litres, 0, true)}</div>
        <div  className={classes.dataCell}>
          <Input
              className={classes.input}
              id={`${t.id}_delivery`}
              name="delivery"
              onBlur={(e) => this.handleValidateTankLevel(t.id, e)}
              onChange={this.handleChange}
              type="number"
              value={tanks[t.id].delivery}
          />
          </div>
      </div>
    ))
  }

  render() {

    const { classes, data, editMode, havePrevDayDips } = this.props
    let loading = data && data.loading ? true : false
    let submitLabel = 'Save Dips'
    if (data && data.loading === false && editMode === true) {
      submitLabel = 'Edit Dips'
    }

    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="title"
        >Dips</Typography>
        <div className={classes.headerRow}>
          <div className={classes.headerCell}>Tank</div>
          <div className={classNames([classes.headerCell], [classes.alignCenter])}>Level</div>
          <div className={classNames([classes.headerCell], [classes.alignCenter])}>Litres</div>
          <div className={classNames([classes.headerCell], [classes.alignCenter])}>Delivery</div>
          <div className={classNames([classes.headerCell], [classes.narrowCell])} />
        </div>

        {data && this.renderTanks(data, classes)}
        {data && !loading && <div>
          <div className={classes.buttonContainer}>
            <Button
                className={classes.submitButton}
                color="primary"
                disabled={!havePrevDayDips}
                onClick={this.handleDipSumit.bind(this)}
                variant="raised"
            >
              <Save className={classNames(classes.leftIcon, classes.iconSmall)} />
              {submitLabel}
            </Button>
            <div className={classes.submitMsg}>
              {loading && <div>Loading...</div>}
            </div>
          </div>
          {data && !havePrevDayDips &&
            <div>
            <Alert type="info">Previous day dips missing. Ensure dips are entered consecutively.</Alert>
            </div>
          }
          </div>
        }
        <Toaster message={this.state.toasterMsg} />
      </div>
    )
  }
}

DipForm.propTypes = {
  actions:          PropTypes.object.isRequired,
  classes:          PropTypes.object.isRequired,
  data:             PropTypes.object,
  editMode:         PropTypes.bool.isRequired,
  havePrevDayDips:  PropTypes.bool.isRequired,
  mutate:           PropTypes.func.isRequired,
}

const styles =  theme => ({
  alignRight: {
    textAlign: 'right',
  },
  alignCenter: {
    textAlign: 'center',
  },
  buttonContainer: {
    display:        'flex',
    flexDirection:  'column',
  },
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
  },
  dataAlignRight: {
    textAlign:    'right',
    marginRight:  theme.spacing.unit * 7,
    marginLeft:   -(theme.spacing.unit * 7),
  },
  dataCell: {
    alignSelf:      'flex-end',
    flex:           1,
    padding:        theme.spacing.unit,
    paddingBottom:  theme.spacing.unit * 2,
  },
  dataRowError: {
    backgroundColor: '#FAC7C6',
  },
  dataRow: {
    borderBottomColor:  '#efefef',
    borderBottomStyle:  'solid',
    borderBottomWidth:  1,
    display:            'inline-flex',
    flexDirection:      'row',
  },
  delButton: {
    minWidth: 0,
  },
  input: {
    paddingLeft:  10,
    width:        theme.spacing.unit * 15,
  },
  headerRow: {
    borderBottomColor:  '#efefef',
    borderBottomStyle:  'solid',
    borderBottomWidth:  1,
    display:            'inline-flex',
    flexDirection:      'row',
    paddingBottom:      4,
  },
  headerCell: {
    color:      theme.palette.secondary.main,
    flex:       1,
    fontWeight: '500',
    padding:    theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  narrowCell: {
    flex:           .5,
    padding:        0,
    paddingBottom:  theme.spacing.unit,
  },
  submitButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,
  },
  submitMsg: {
    margin: 'auto',
  },
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...errorActions,
    }, dispatch),
  }
}

const styledForm = withStyles(styles)(DipForm)

const connectedForm = connect(
  null,
  mapDispatchToProps
)(styledForm)

export default graphql(CREATE_DIPS, {
  skip: true,
  /*props: (props) => {
    console.log('props: ', props)
  // props: ({ data: { loading, error, networkStatus } }) => {
    if (loading) {
      return { loading }
    }

    if (error) {
      return { error }
    }

    return {
      // loading: false,
      networkStatus,
    }
    return { mutate: props.mutate}
  },*/
})(connectedForm)

