import React, { Component } from 'react'
import PropTypes from 'prop-types'

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
import { fmtNumber } from '../../utils/utils'
const R = require('ramda')

class DipForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tanks: null,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleCalculateLitres = debounce(this.handleCalculateLitres, 350)
  }

  componentWillMount = () => {
    this.timer = null
  }

  componentDidUpdate = prevProps => {

    let tanks = {}
    const { data } = this.props
    if (data !== prevProps.data && data.loading === false && data.stationTanks) {
      const dips = data.dips
      data.stationTanks.forEach(t => {
        const tmp = {
          level: '',
          litres: null,
          delivery: '',
          tank: t,
        }
        if (dips) {
          tmp.dips = R.find(R.propEq('stationTankID', t.id))(data.dips)
          tmp.level = tmp.dips.level
          tmp.litres = tmp.dips.litres
          if (tmp.dips.fuelDelivery) {
            tmp.delivery = tmp.dips.fuelDelivery.litres
          }
        }
        tanks[t.id] = tmp
      })
      this.setState(() => ({tanks})) // eslint-disable-line
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
    this.setState(() => ({tanks}))

    if (field === 'level') {
      this.handleCalculateLitres(id, val)
    }
  }

  handleCalculateLitres = (tankID, val) => {

    // If user deletes value entirely, we need to zero out entry
    let tanks = this.state.tanks

    if (!val) {
      tanks[tankID].level = 0
      tanks[tankID].litres = 0
      this.setState(() => ({tanks}))
      return
    }

    let inputLevel = parseInt(val, 10)
    const levels = tanks[tankID].tank.tank.Levels
    while (!levels[inputLevel]) {
      inputLevel += 1
    }
    tanks[tankID].level = inputLevel
    tanks[tankID].litres = levels[inputLevel].litres
    this.setState(() => ({tanks}))
  }

  handleSubmit = () => {
    this.props.actions.errorSend({message: 'Propane Saved'})
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
      })
    }

    return rows.map((t, i) => (
      <div
          className={classes.dataRow}
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
              onChange={this.handleChange}
              type="number"
              value={tanks[t.id].delivery}
          />
          </div>
      </div>
    ))
  }

  submitReport = () => {
    const tanks = this.state.tanks
    let error = false
    for (const t in tanks) {
      if (tanks[t].level === null) {
        error = true
        break
      }
      // console.log('t.id: ', tanks[t].level)
    }
    //todo: add toaster snackbar here

    this.props.actions.errorSend({message: 'Generic error message here...\nfooo \n bar', type: 'danger'})

    if (error) {
      console.error('invalid form tanks: ', tanks)
    }
  }

  render() {

    const { classes, data, editMode, havePrevDayDips } = this.props
    // console.log('data: ', data)

    let loading = data && data.loading ? true : false

    let submitLabel = 'Save Dips'
    if (data && data.loading === false && editMode === true) {
      submitLabel = 'Edit Dips'
    }

    return (
      <div className={classes.container}>
        {/*<Errors />*/}
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
        {data && !loading && <div className={classes.buttonContainer}>
        <Button
            className={classes.submitButton}
            color="primary"
            disabled={!havePrevDayDips}
            onClick={this.submitReport}
            variant="raised"
        >
          <Save className={classNames(classes.leftIcon, classes.iconSmall)} />
          {submitLabel}
        </Button>
        {data && !havePrevDayDips &&
          <div>
          <Alert type="info">Previous day dips missing. Ensure dips are entered consecutively.</Alert>
          </div>
        }
        </div>
        }

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
    width:          theme.spacing.unit * 80,
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
  dataRow: {
    borderBottomColor:  '#efefef',
    borderBottomStyle:  'solid',
    borderBottomWidth:  1,
    display:            'inline-flex',
    flexDirection:      'row',
    '&:hover': {
      backgroundColor: theme.palette.grey['50'],
    },
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
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...errorActions,
    }, dispatch),
  }
}

const StyledForm = withStyles(styles)(DipForm)

export default connect(
  null,
  mapDispatchToProps
)(StyledForm)
