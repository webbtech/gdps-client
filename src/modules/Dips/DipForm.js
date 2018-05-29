import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import Button from '@material-ui/core/Button'
import Delete from '@material-ui/icons/Delete'
import Input from '@material-ui/core/Input'
import Save from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'

import { withStyles } from '@material-ui/core/styles'

class DipForm extends Component {

  state = {
    tanks: {},
  }

  componentDidMount = () => {
    let tanks = {}
    mockTanks.forEach(t => {
      tanks[t.id] = {level: null, delivery: null}
    })
    this.setState(() => ({tanks}))
  }

  handleChange = (e) => {
    const inputId = e.target.id
    const val     = e.target.value
    const pcs     = inputId.split('_')
    const id      = pcs[0]
    const field   = pcs[1]

    // Using a tmp tank holder appeared to be the only to set the state properly here
    let tanks = this.state.tanks
    tanks[id][field] = val
    this.setState(() => ({tanks}))
  }

  renderTanks = (tank, classes) => {
    return mockTanks.map((t, i) => (
      <div
          className={classes.dataRow}
          key={i}
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
            // value={this.state.weight}
          />
        </div>
        <div className={classNames([classes.dataCell], [classes.dataAlignRight])}>{fmtNumber(t.litres)}</div>
        <div  className={classes.dataCell}>
          <Input
              className={classes.input}
              id={`${t.id}_delivery`}
              onChange={this.handleChange}
              style={{flex: 1}}
              type="number"
            // value={this.state.weight}
          />
          </div>
          <div className={classNames([classes.dataCell], [classes.narrowCell])}>
          <Button
              className={classes.delButton}
              color="secondary"
              disabled={true}
              // onClick={() => this.handleNextPrevDate('n')}
          >
            <Delete style={{padding: 0}} />
          </Button>
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
    if (error) {
      console.error('invalid form tanks: ', tanks)
    }
  }

  render() {

    const { classes } = this.props

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

        {this.renderTanks(mockTanks, classes)}
        <Button
            className={classes.submitButton}
            color="primary"
            onClick={this.submitReport}
            variant="raised"
        >
          <Save className={classNames(classes.leftIcon, classes.iconSmall)} />
          Save Dips
        </Button>

      </div>
    )
  }
}

DipForm.propTypes = {
  classes:  PropTypes.object.isRequired,
}

const styles =  theme => ({
  alignRight: {
    textAlign: 'right',
  },
  alignCenter: {
    textAlign: 'center',
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
    width: theme.spacing.unit * 15,
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

const mockTanks = [
  {
    id: '123',
    tankID: '11',
    size: 26320,
    fuelType: 'DSL',
    litres: null,
  },
  {
    id: '456',
    tankID: '18',
    size: 75523,
    fuelType: 'NL',
    litres: null,
  },
  {
    id: '789',
    tankID: '12',
    size: 25479,
    fuelType: 'SNL',
    litres: null,
  },
]

// todo: a variation of this, with decimal places, should be added to a utils library
const fmtNumber = number => {
  return new Intl.NumberFormat('en-US').format(number)
}

export default withStyles(styles)(DipForm)
