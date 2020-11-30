import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import Paper from '@material-ui/core/Paper'
import red from '@material-ui/core/colors/red'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import TankLevelsDialog from './TankLevelsDialog'


class TankForm extends Component {
  handleSubmit = (e) => {
    e.preventDefault()
    this.props.handleSubmit(e)
  }

  render() {
    const {
      classes,
      data,
      dirty,
      errors,
      handleBlur,
      handleChange,
      isSubmitting,
      setFieldValue,
      values,
    } = this.props

    const isEditMode = data && data.tank
    const formTitle = isEditMode ? `Edit Tank Info (id: ${values.id})` : 'Enter Tank Info'

    // todo: add AppBar here
    return (
      <Paper className={classes.container}>
        <AppBar
          color="default"
          position="static"
        >
          <Toolbar>
            <Typography
              className={classes.title}
              gutterBottom
              variant="h6"
            >{formTitle}
            </Typography>
            {isEditMode &&
              <TankLevelsDialog
                tank={data.tank}
              />
            }
          </Toolbar>
        </AppBar>
        {data && data.error &&
          <div className={classNames(classes.dataMsg, classes.errMsg)}>
            Recieved error: {data.error.message}
          </div>
        }
        {data && data.loading && <div className={classes.dataMsg}>Loading...</div>}
        {errors && errors.graphql &&
          <div className={classNames(classes.dataMsg, classes.errMsg)}>
            Received data error: {errors.graphql}
          </div>
        }
        <form
          autoComplete="off"
          className={classes.form}
          noValidate
          onSubmit={this.handleSubmit}
        >
          <input
            id="tankID"
            type="hidden"
            value={values.id || ''}
          />

          <FormControl
            aria-describedby="size-helper-text"
            className={classes.formControl}
            error={!!errors.size}
          >
            <InputLabel htmlFor="size">Capacity</InputLabel>
            <Input
              autoFocus={!isEditMode}
              id="size"
              onBlur={handleBlur}
              onChange={handleChange}
              type="number"
              value={values.size || ''}
            />
            <FormHelperText id="size-text">{errors.size}</FormHelperText>
          </FormControl>

          <FormControl
            aria-describedby="model-helper-text"
            className={classes.formControl}
            error={!!errors.model}
          >
            <InputLabel htmlFor="model">Model</InputLabel>
            <Input
              id="model"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.model || ''}
            />
            <FormHelperText id="model-text">{errors.model}</FormHelperText>
          </FormControl>

          <FormControl
            aria-describedby="description-helper-text"
            className={classes.formControl}
            error={!!errors.description}
          >
            <InputLabel htmlFor="description">Description</InputLabel>
            <Input
              id="description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.description || ''}
            />
            <FormHelperText id="description-text">{errors.description}</FormHelperText>
          </FormControl>

          <FormControl
            aria-describedby="description-helper-text"
            className={classes.formControl}
            error={!!errors.levelsFile}
          >
            <InputLabel htmlFor="levelsFile">Levels File</InputLabel>
            <Input
              id="levelsFile"
              name="levelsFile"
              onBlur={handleBlur}
              onChange={(event) => {
                  setFieldValue('levelsFile', event.currentTarget.files[0])
                }}
              type="file"
            />
            <FormHelperText id="levelsFile-text">{errors.levelsFile}</FormHelperText>
          </FormControl>
          <Button
            className={classes.submitButton}
            color="primary"
            disabled={!dirty || isSubmitting}
            type="submit"
            variant="contained"
          >
          Submit
          </Button>
        </form>
      </Paper>
    )
  }
}
TankForm.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  data: PropTypes.instanceOf(Object),
  dirty: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object),
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  values: PropTypes.instanceOf(Object),
}
TankForm.defaultProps = {
  data: null,
  errors: null,
  values: null,
}

const styles = theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    margin: 'auto',
    width: 400,
  },
  dataMsg: {
    marginBottom: theme.spacing.unit,
  },
  errMsg: {
    color: red[400],
    fontWeight: 500,
  },
  fileField: {
    color: '#000666',
  },
  formControl: {
    flex: 1,
    marginBottom: theme.spacing.unit * 1,
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing.unit * 2,
  },
  submitButton: {
    flex: 1,
    marginTop: theme.spacing.unit * 2,
    width: '100%',
  },
  title: {
    flexGrow: 1,
  },
})

export default withStyles(styles)(TankForm)
