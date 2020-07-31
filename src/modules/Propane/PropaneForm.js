import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import Button from '@material-ui/core/Button'
import Delete from '@material-ui/icons/Delete'
import Input from '@material-ui/core/Input'
import Save from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import PropaneSelectors from './PropaneSelectors'
import { dateToInt } from '../../utils/date'


class PropaneForm extends Component {
  removeDelivery = async () => {
    const { actions, RemoveDelivery, match: { params } } = this.props
    const input = {
      date: dateToInt(params.date),
    }
    let graphqlReturn
    try {
      graphqlReturn = await RemoveDelivery(input)
      if (graphqlReturn && graphqlReturn.errors) {
        actions.errorSend({ message: graphqlReturn.errors[0].message, type: 'danger' })
      }
    } catch (error) {
      actions.errorSend({ message: error.message, type: 'danger' })
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.handleSubmit(e)
  }

  render() {
    const {
      classes,
      dirty,
      handleChange,
      isSubmitting,
      values,
    } = this.props

    return (
      <div className={classes.container}>
        <Typography
          gutterBottom
          variant="h6"
        >Propane Delivery
        </Typography>
        <PropaneSelectors />

        <form
          autoComplete="off"
          className={classes.form}
          noValidate
          onSubmit={this.handleSubmit}
        >
          <div className={classes.dataRow}>
            <div className={classes.dataCell}>
              <Input
                autoFocus
                name="litres"
                onChange={handleChange}
                placeholder="Litres"
                type="number"
                value={values.litres}
              />
            </div>
            <div className={classNames([classes.dataCell], [classes.narrowCell])}>
              <Button
                className={classes.delButton}
                color="secondary"
                disabled={!values.litres}
                onClick={this.removeDelivery}
              >
                <Delete style={{ padding: 0 }} />
              </Button>
            </div>
          </div>

          <div>
            <Button
              className={classes.submitButton}
              color="primary"
              disabled={!dirty || isSubmitting}
              type="submit"
              variant="contained"
            >
              <Save className={classNames(classes.leftIcon, classes.iconSmall)} />
                Save Propane Delivery
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

PropaneForm.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  dirty: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  values: PropTypes.instanceOf(Object).isRequired,
}

const styles = theme => ({
  alignRight: {
    textAlign: 'right',
  },
  alignCenter: {
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    width: theme.spacing.unit * 40,
    margin: 'auto',
  },
  dataCell: {
    alignSelf: 'flex-end',
    flex: 1,
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2,
  },
  dataRow: {
    display: 'inline-flex',
    flexDirection: 'row',
  },
  delButton: {
    minWidth: 0,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  submitButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,
  },
})

export default withStyles(styles)(PropaneForm)
