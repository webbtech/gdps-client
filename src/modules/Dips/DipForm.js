import React, { Component } from 'react'
import PropTypes from 'prop-types'

// import gql from 'graphql-tag'
// import { graphql } from 'react-apollo'
import { withRouter } from 'react-router'


import classNames from 'classnames'
import { debounce } from 'lodash'

import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import Save from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'


import Alert from '../Common/Alert'
import Toaster from '../Common/Toaster'
import { DIP_QUERY } from './Dips.cont'
import { fmtNumber } from '../../utils/utils'


class DipForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      haveErrors: false,
      tanks: props.tankDips,
      toasterMsg: '',
    }
    this.createDipsVars = this.createDipsVars.bind(this)
    this.handleCalculateLitres = debounce(this.handleCalculateLitres, 400)
  }

  componentDidUpdate = prevProps => {
    // When route changes, update state
    const { match: { params }, tankDips } = this.props
    const prevParams = prevProps.match.params
    if (prevParams.stationID !== params.stationID || prevParams.date !== params.date) {
      this.setState(() => ({tanks: tankDips}))
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
    const { variables } = this.props.dips
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
    const { variables } = this.props.dips
    return {
      date:       variables.date,
      dateFrom:   variables.dateFrom,
      dateTo:     variables.dateTo,
      stationID:  variables.stationID,
    }
  }

  render() {

    console.log('props in DipForm: ', this.props)

    const { classes, editMode, havePrevDayDips, tankDips } = this.props
    const { tanks } = this.state
    let submitLabel = editMode ? 'Edit Dips' : 'Save Dips'

    let rows = []
    for (const t in tankDips) {
      rows.push({
        id:       t,
        fuelType: tankDips[t].tank.fuelType,
        tankID:   tankDips[t].tank.tankID,
        size:     tankDips[t].tank.tank.size,
        dlError:  tankDips[t].dlError,
      })
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

        {rows.map((t, i) => (
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
        ))}
        <div>
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
          </div>
          {!havePrevDayDips &&
            <div>
            <Alert type="info">Previous day dips missing. Ensure dips are entered consecutively.</Alert>
            </div>
          }
          </div>
        <Toaster message={this.state.toasterMsg} />
      </div>
    )
  }
}

DipForm.propTypes = {
  // actions:          PropTypes.object.isRequired,
  classes:          PropTypes.object.isRequired,
  editMode:         PropTypes.bool.isRequired,
  havePrevDayDips:  PropTypes.bool.isRequired,
  match:            PropTypes.object.isRequired,
  // mutate:           PropTypes.func.isRequired,
  tankDips:         PropTypes.object.isRequired,
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

export default withRouter(withStyles(styles)(DipForm))
