import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Mutation } from 'react-apollo'
import classNames from 'classnames'

import AppBar from '@material-ui/core/AppBar'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Loader from '../Common/Loader'
import StationSelector from '../Common/StationSelector'
import AddTankDialog from './AddTankDialog'
import Toaster from '../Common/Toaster'
import { extractPathParts } from '../../utils/utils'
import { FUEL_TYPE_LIST as fuelTypeList } from '../../config/constants'
import { TANK_QUERY, TOGGLE_ACTIVE_MUTATION } from './StationTanks.cntr'

const sortTanks = (fuelTypes, tanks) => {
  const ret = []
  fuelTypes.forEach((ft) => {
    tanks.forEach((tank) => {
      if (tank.fuelType === ft) {
        ret.push(tank)
      }
    })
  })
  return ret
}

class StationTanks extends Component {
  state = {
    stationID: '',
    toasterMsg: '',
  }

  componentDidMount = () => {
    const pathPrts = extractPathParts(this.props.location.pathname, 3)
    if (!pathPrts) return
    const stationID = pathPrts[0]
    if (stationID) {
      this.setState({ stationID })
    }
  }

  handleStationChange = (value) => {
    this.setState({ stationID: value }, this.handlePushURI)
  }

  handlePushURI = () => {
    const { stationID } = this.state
    if (stationID) {
      const uri = `/admin/station-admin/${stationID}`
      this.props.history.push(uri)
    }
  }
  // see: https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6
  // for example on loading external data
  /* static getDerivedStateFromProps = (props) => {
    const stationID = props.location.pathname.split('/')[2]
    if (stationID) {
      return { stationID }
    }
    return null
  } */

  setToggleVars = tank => ({
    fields: {
      id: tank.id,
      active: !tank.active,
    },
  })

  handleUpdateComplete = () => {
    this.setState({ toasterMsg: 'Tank active status updated' })
  }

  render() {
    const { classes, data } = this.props
    const { stationID } = this.state

    if (data && data.loading) {
      return <div className={classes.container}><Loader /></div>
    }

    let tanks = []
    if (data && data.stationTanksWithList) {
      tanks = sortTanks(fuelTypeList, data.stationTanksWithList.currentTanks)
    }

    return (
      <div className={classes.container}>
        <Typography
          gutterBottom
          variant="h5"
        >Station Tank Administration
        </Typography>
        <Paper className={classes.dataContainer}>
          <AppBar
            color="default"
            position="static"
          >
            <Toolbar>
              <FormControl className={classes.stationSelector}>
                <StationSelector
                  onStationChange={this.handleStationChange}
                  stationID={stationID}
                />
              </FormControl>
              <AddTankDialog stationID={this.state.stationID} />
            </Toolbar>
          </AppBar>

          {tanks.length <= 0
            ? (<div className={classes.instructMsg}>Select a station to view tanks</div>)
            : (
              <div className={classes.dataContainer}>
                <div className={classes.headerRow}>
                  <div className={classes.headerCellSm}>ID</div>
                  <div className={classes.headerCell}>Fuel Type</div>
                  <div className={classes.headerCell}>Size</div>
                  <div className={classes.headerCell}>Active</div>
                </div>

                <Mutation
                  mutation={TOGGLE_ACTIVE_MUTATION}
                  onCompleted={this.handleUpdateComplete}
                >
                  {(toggleActive, { loading, error }) => (
                    <div>
                      {tanks.map(t => (
                        <div
                          className={classNames(classes.dataRow, { [classes.rowInactive]: !t.active })}
                          key={t.id}
                          onClick={() => {
                              toggleActive({
                                variables: this.setToggleVars(t),
                                refetchQueries: [{ query: TANK_QUERY, variables: { stationID } }],
                              })
                            }}
                        >
                          <div className={classes.dataCellSm}>{t.tankID}</div>
                          <div className={classes.dataCell}>{t.fuelType}</div>
                          <div className={classes.dataCell}>{t.tank.size}</div>
                          <div className={classes.dataCell}>
                            <Checkbox
                              checked={t.active}
                              classes={{ root: classes.checkboxRoot }}
                            />
                          </div>
                        </div>
                      ))}
                      <div className={classNames(classes.dataRow, classes.errorMsg)}>
                        {loading && <div>Processing...</div>}
                        {error && <div>Error :( Please try again</div>}
                      </div>
                    </div>
                  )}
                </Mutation>
              </div>
            )
          }
        </Paper>
        <Toaster
          duration={1000}
          message={this.state.toasterMsg}
        />
      </div>
    )
  }
}

StationTanks.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  // stationID:  PropTypes.string.isRequired,
}

const styles = theme => ({
  checkboxRoot: {
    padding: 0,
    height: 10,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    margin: 'auto',
    width: 400,
  },
  dataCell: {
    flex: 1,
  },
  dataCellSm: {
    flex: 0.5,
  },
  dataContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  dataRow: {
    borderBottom: 'solid 1px',
    borderBottomColor: theme.palette.grey['300'],
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit * 2,
    '&:hover': {
      backgroundColor: theme.palette.grey['100'],
      cursor: 'pointer',
    },
  },
  errorMsg: {
    borderBottom: 'none',
    paddingLeft: theme.spacing.unit,
    height: 40,
  },
  headerRow: {
    borderBottomColor: '#efefef',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    color: theme.palette.grey['700'],
    display: 'inline-flex',
    flexDirection: 'row',
    padding: theme.spacing.unit,
  },
  headerCell: {
    flex: 1,
    fontWeight: '500',
    padding: theme.spacing.unit,
  },
  headerCellSm: {
    flex: 0.5,
    fontWeight: '500',
    padding: theme.spacing.unit,
  },
  instructMsg: {
    padding: theme.spacing.unit * 2,
  },
  rowInactive: {
    opacity: 0.5,
  },
  submitButton: {
    margin: theme.spacing.unit * 2,
    marginLeft: 0,
  },
  table: {
    minWidth: 400,
    width: 500,
  },
  stationSelector: {
    flexGrow: 1,
  },
})

export default withStyles(styles)(StationTanks)
