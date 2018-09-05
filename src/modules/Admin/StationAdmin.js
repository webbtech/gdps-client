import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FormControl from '@material-ui/core/FormControl'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import StationSelector from '../Common/StationSelector'
import StationTanks from './StationTanks'
import { extractPathParts } from '../../utils/utils'

class StationAdmin extends Component {

  state = {
    stationID: '',
  }

  componentDidMount = () => {
    const pathPrts = extractPathParts(this.props.location.pathname, 3)
    if (!pathPrts) return
    const stationID = pathPrts[0]
    if (stationID) {
      this.setState({ stationID })
    }
  }

  handleStationChange = value => {
    this.setState({ stationID: value }, this.handlePushURI)
  }

  handlePushURI = () => {
    const { history, match } = this.props
    const { stationID } = this.state
    if (stationID) {
      const uri = `${match.url}/${stationID}`
      history.push(uri)
    }
  }

  render() {

    const { classes } = this.props
    const { stationID } = this.state

    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="title"
        >Station Tank Administration</Typography>

        <div className={classes.selectRow}>

          <div className={classes.cell}>
            <FormControl className={classes.formControl}>
              <StationSelector
                  onStationChange={this.handleStationChange}
                  stationID={stationID}
              />
            </FormControl>
          </div>
        </div>

        <div className={classes.selectRow}>
          <StationTanks stationID={stationID} />
        </div>
      </div>
    )
  }
}
StationAdmin.propTypes = {
  classes:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match:    PropTypes.object.isRequired,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    margin:         'auto',
    width:          700,
  },
})

export default withStyles(styles)(StationAdmin)
