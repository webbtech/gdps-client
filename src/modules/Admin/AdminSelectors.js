import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'

// import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { withStyles } from '@material-ui/core/styles'


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
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
})

const mockStations = [
  { id: 'b-10', name: 'Bridge' },
  { id: 'ch-20', name: 'Chippawa' },
  { id: 'co-30', name: 'Collier' },
  { id: 'd-40', name: 'Drummond' },
]

export default withRouter(withStyles(styles)(AdminSelectors))
