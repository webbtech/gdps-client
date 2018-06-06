import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'

import Button from '@material-ui/core/Button'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'
import { withStyles } from '@material-ui/core/styles'

class StationInfo extends Component {

  state = {
    stationID: '',
    submitting: false,
  }

  // see: https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6
  // for example on loading external data
  static getDerivedStateFromProps = (props) => {
    const stationID = props.location.pathname.split('/')[2]
    if (stationID) {
      return { stationID }
    }
    return null
  }

  handleChange = (e, val) => {
    this.setState({ [e.target.value]: val })
  }

  handleOpenSnack = msg => {
    this.setState({ snackOpen: true, snackMsg: msg})
  }

  handleClose = () => {
    this.setState({ snackOpen: false })
  }

  onSubmitForm = () => {
    this.setState({ submitting: true })
  }

  render() {

    const { classes } = this.props
    const { submitting } = this.state

    if (!this.state.stationID) return null

    return (
      <div className={classes.container}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Select Tanks</FormLabel>
          <FormGroup>
            {mockTanks.map(t => (
              <FormControlLabel
                  control={
                    <Checkbox
                        checked={this.state[t.id]}
                        onChange={(e, val) => this.handleChange(e, val, t.id)}
                        value={t.id}
                    />
                  }
                  key={t.id}
                  label={t.tankID}
              />
            ))}
          </FormGroup>
          <FormHelperText>Removal of existing tanks may cause issues.</FormHelperText>
        </FormControl>
        <Button
            className={classes.submitButton}
            color="primary"
            disabled={submitting}
            onClick={() => this.onSubmitForm()}
            variant="raised"
        >
          {submitting ? 'Stand by...' : 'Update Station Tanks'}
        </Button>
      </div>
    )
  }
}

StationInfo.propTypes = {
  classes:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    margin:         theme.spacing.unit,
    marginLeft:     theme.spacing.unit * 10,
    marginTop:      theme.spacing.unit * 3,
    width:          300,
  },
  submitButton: {
    margin:     theme.spacing.unit * 2,
    marginLeft: 0,
  },
  table: {
    minWidth: 400,
    width:    500,
  },
})

const mockTanks = [
  {id: 'abc123', tankID: '8E', size: 75000},
  {id: 'abc234', tankID: '18', size: 75523},
  {id: 'abc345', tankID: '19', size: 20252},
]

export default withRouter(withStyles(styles)(StationInfo))
