import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'
import { clone, debounce } from 'lodash'

import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import Save from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'

import Alert from '../Common/Alert'
import Toaster from '../Common/Toaster'
import { fmtNumber } from '../../utils/utils'


class DipForm extends Component {

  constructor(props) {
    super(props)
    this.state = {
      haveErrors: false,
      toasterMsg: '',
    }
    this.handleCalculateLitres = debounce(this.handleCalculateLitres, 250)
  }

  // see: https://stackoverflow.com/questions/23123138/perform-debounce-in-react-js for explanation on debounce
  handleChange = (e) => {
    e.persist()
    const inputId = e.target.id
    const val     = e.target.value
    const pcs     = inputId.split('_')
    const tankID  = pcs[0]
    const field   = pcs[1]

    // Clear any previous tank errors
    delete this.props.errors[tankID]
    this.props.actions.errorClear()

    if (val) {
      this.props.setFieldValue(`tanks.${tankID}.${field}`, Number(val), false)
    } else {
      this.props.setFieldValue(`tanks.${tankID}.${field}`, '', false)
    }

    if (field === 'level') {
      this.handleCalculateLitres(tankID, val)
    }
  }

  handleCalculateLitres = (tankID, val) => {

    let { errors } = this.props
    let { tanks } = this.props.values

    // Clear any old errors related this this tank
    delete errors[`${tankID}_level`]

    if (!val || val === '0') {
      this.props.setFieldValue(`tanks.${tankID}.level`, '', false)
      this.props.setFieldValue(`tanks.${tankID}.litres`, 0, false)
      return
    }

    let inputLevel = parseInt(val, 10)
    const origLevel = clone(inputLevel)
    if (inputLevel <= 1) return
    const levels = tanks[tankID].tank.tank.levels
    if (inputLevel > 9 && !levels[inputLevel]) {
      inputLevel--
    }

    tanks[tankID].level = inputLevel
    if (levels[inputLevel]) {
      this.props.setFieldValue(`tanks.${tankID}.litres`, levels[inputLevel].litres, false)
    } else {
      this.props.setFieldValue(`tanks.${tankID}.level`, origLevel, false)
      this.props.setFieldError([`${tankID}_level`], 'Invalid field level')
    }
  }

  handleDipComplete = () => {
    this.setState({toasterMsg: 'Dip entry successfully persisted'})
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.handleSubmit(e)
  }

  render() {

    const {
      classes,
      dirty,
      editMode,
      errors,
      havePrevDayDips,
      isSubmitting,
      tankDips,
      values,
    } = this.props
    const errorKeys = Object.keys(errors).length
    let submitLabel = editMode ? 'Edit Dips' : 'Save Dips'

    let rows = []
    for (const t in tankDips) {
      rows.push({
        id:       t,
        fuelType: tankDips[t].tank.fuelType,
        tankID:   tankDips[t].tank.tankID,
        size:     tankDips[t].tank.tank.size,
      })
    }

    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="h6"
        >Dips</Typography>

        <form
            autoComplete="off"
            className={classes.form}
            noValidate
            onSubmit={this.handleSubmit}
        >
          <div className={classes.headerRow}>
            <div className={classes.headerCell}>Tank</div>
            <div className={classNames([classes.headerCell], [classes.alignCenter])}>Level</div>
            <div className={classNames([classes.headerCell], [classes.alignCenter])}>Litres</div>
            <div className={classNames([classes.headerCell], [classes.alignCenter])}>Delivery</div>
            <div className={classNames([classes.headerCell], [classes.narrowCell])} />
          </div>

          {rows.map((t, i) => (
            <div
                className={classNames(
                  classes.dataRow,
                  {[classes.errorDanger]: errors[t.id]}
                )}
                key={t.id}
            >
              <div className={classNames(classes.dataCell, classes.botSpacerField)}>
                {t.size} ({t.tankID})
                <span style={{display: 'inline', marginLeft: 15}}>{t.fuelType}</span>
              </div>
              <div className={classes.dataCell}>
                <FormControl
                    aria-describedby="size-helper-text"
                    className={classes.formControl}
                    error={!!errors[`${t.id}_level`]}
                >
                  <Input
                      autoFocus={i === 0}
                      className={classes.input}
                      id={`${t.id}_level`}
                      onChange={this.handleChange}
                      type="number"
                      value={values.tanks[t.id] ? values.tanks[t.id].level : ''}
                  />
                  <FormHelperText id="level-text">{errors[`${t.id}_level`]}</FormHelperText>
                </FormControl>
              </div>
              <div className={classNames(classes.dataCell, classes.dataAlignRight, classes.botSpacerField)}>
                {values.tanks[t.id] && fmtNumber(values.tanks[t.id].litres, 0, true)}
              </div>
              <div  className={classes.dataCell}>
                <FormControl
                    aria-describedby="size-helper-text"
                    className={classes.formControl}
                    error={!!errors[`${t.id}_delivery`]}
                >
                  <Input
                      className={classes.input}
                      id={`${t.id}_delivery`}
                      name="delivery"
                      onChange={this.handleChange}
                      type="number"
                      value={values.tanks[t.id].delivery}
                  />
                  <FormHelperText id="delivery-text">{errors[`${t.id}_delivery`]}</FormHelperText>
                </FormControl>
              </div>
            </div>
          ))}
          <div>
            <div className={classes.buttonContainer}>
              <Button
                  className={classes.submitButton}
                  color="primary"
                  disabled={!dirty || isSubmitting || !!errorKeys}
                  type="submit"
                  variant="contained"
              >
                <Save className={classNames(classes.leftIcon, classes.iconSmall)} />
                {submitLabel}
              </Button>
            </div>
            {!havePrevDayDips &&
              <Alert type="info">Previous day dips missing. Ensure dips are entered consecutively.</Alert>
            }
          </div>
        </form>
        <Toaster message={this.state.toasterMsg} />
      </div>
    )
  }
}

DipForm.propTypes = {
  actions:          PropTypes.object.isRequired,
  classes:          PropTypes.object.isRequired,
  dirty:            PropTypes.bool.isRequired,
  editMode:         PropTypes.bool.isRequired,
  errors:           PropTypes.object.isRequired,
  handleSubmit:     PropTypes.func.isRequired,
  havePrevDayDips:  PropTypes.bool.isRequired,
  isSubmitting:     PropTypes.bool.isRequired,
  match:            PropTypes.object.isRequired,
  setFieldError:    PropTypes.func.isRequired,
  setFieldValue:    PropTypes.func.isRequired,
  tankDips:         PropTypes.object.isRequired,
  values:           PropTypes.object.isRequired,
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
  errorDanger: {
    backgroundColor: red[100],
  },
  form: {
    display:        'flex',
    flexDirection:  'column',
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
  botSpacerField: {
    marginBottom: theme.spacing.unit * 3,
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
    margin:     theme.spacing.unit,
    marginTop:  theme.spacing.unit * 3,
  },
  submitMsg: {
    margin: 'auto',
  },
})

export default withStyles(styles)(DipForm)
