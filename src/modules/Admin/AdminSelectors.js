import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { withStyles } from '@material-ui/core/styles'

const mockStations = [
  { id: 'b-10', name: 'Bridge' },
  { id: 'ch-20', name: 'Chippawa' },
  { id: 'co-30', name: 'Collier' },
  { id: 'd-40', name: 'Drummond' },
]

class AdminSelectors extends Component {
  state = {
    stationID: '',
  }

  componentDidMount = () => {
    const { pathname } = this.props.location
    const stationID = pathname.split('/')[2]

    if (stationID) {
      this.setState({ stationID })
    }
  }

  handleStationChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, this.handleSetStation)
  }

  handleSetStation = () => {
    const { history, match } = this.props
    const { stationID } = this.state

    if (stationID) {
      const uri = `${match.url}/${stationID}`
      history.push(uri)
    }
  }

  render() {
    const { classes } = this.props

    return (
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="station-select">Station</InputLabel>
          <Select
            inputProps={{
                name: 'stationID',
                id: 'station-select',
              }}
            onChange={this.handleStationChange}
            value={this.state.stationID}
          >
            {mockStations.map(s => (
              <MenuItem
                key={s.id}
                value={s.id}
              >
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    )
  }
}

AdminSelectors.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  location: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
}

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
})

export default withRouter(withStyles(styles)(AdminSelectors))
