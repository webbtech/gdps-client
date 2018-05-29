import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import Button from '@material-ui/core/Button'
import Delete from '@material-ui/icons/Delete'
import Input from '@material-ui/core/Input'
import Save from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'

import { withStyles } from '@material-ui/core/styles'


class PropaneForm extends Component {

  state = {
    litres: '',
  }

  handleChange = prop => event => {
    this.setState({ [prop]: parseInt(event.target.value, 10) })
  }

  submitForm = () => {

    // let error = false
    const { pathname } = this.props.location
    const date = pathname.split('/')[2]
    let formVals = {
      date,
      litres: parseInt(this.state.litres, 10),
    }
    console.log('formVals: ', formVals)
    /*if (error) {
      console.error('invalid form litres: ', formVals)
    }*/
  }

  render() {

    const { classes } = this.props
    const { litres } = this.state

    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="title"
        >Delivery</Typography>

        <div className={classes.dataRow}>

          <div className={classes.dataCell}>
            <Input
                autoFocus
                // className={classes.input}
                // id={`${t.id}_level`}
                name="litres"
                onChange={this.handleChange('litres')}
                placeholder="Litres"
                type="number"
                value={litres}
            />
          </div>
          <div className={classNames([classes.dataCell], [classes.narrowCell])}>
            <Button
                className={classes.delButton}
                color="secondary"
                // disabled={true}
                // onClick={() => this.handleNextPrevDate('n')}
            >
              <Delete style={{padding: 0}} />
            </Button>
          </div>
        </div>

        <Button
            className={classes.submitButton}
            color="primary"
            onClick={this.submitForm}
            variant="raised"
        >
          <Save className={classNames(classes.leftIcon, classes.iconSmall)} />
          Save Propane Delivery
        </Button>

      </div>
    )
  }
}

PropaneForm.propTypes = {
  classes:  PropTypes.object.isRequired,
  location:  PropTypes.object.isRequired,
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
    width:          theme.spacing.unit * 40,
  },
  dataCell: {
    alignSelf:      'flex-end',
    flex:           1,
    padding:        theme.spacing.unit,
    paddingBottom:  theme.spacing.unit * 2,
  },
  dataRow: {
    display:            'inline-flex',
    flexDirection:      'row',
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
