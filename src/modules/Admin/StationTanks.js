import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import { graphql, Mutation } from 'react-apollo'
import { withRouter } from 'react-router'
import classNames from 'classnames'

import Checkbox from '@material-ui/core/Checkbox'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Toaster from '../Common/Toaster'
import Loader from '../Common/Loader'
import { FUEL_TYPE_LIST as fuelTypeList } from '../../config/constants'


const TANK_QUERY = gql`
query StationTanksWithList($stationID: String!) {
  stationTanksWithList(stationID: $stationID) {
    currentTanks {
      id
      active
      fuelType
      tankID
      tank {
        id
        size
      }
    }
  }
}
`

const TOGGLE_ACTIVE_MUTATION = gql`
mutation ToggleActive($fields: StationTankActiveInput) {
  toggleActive(input: $fields) {
    ok
    nModified
  }
}
`

const sortTanks = (fuelTypes, tanks) => {
  let ret = []
  fuelTypes.forEach(ft => {
    tanks.forEach(tank => {
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

  // see: https://gist.github.com/bvaughn/982ab689a41097237f6e9860db7ca8d6
  // for example on loading external data
  /*static getDerivedStateFromProps = (props) => {
    const stationID = props.location.pathname.split('/')[2]
    if (stationID) {
      return { stationID }
    }
    return null
  }*/

  setToggleVars = tank => {
    return {
      fields: {
        id: tank.id,
        active: !tank.active,
      },
    }
  }

  handleUpdateComplete = () => {
    this.setState({toasterMsg: 'Tank active status updated'})
  }

  render() {

    const { classes, data, stationID } = this.props

    if (!data) return null
    if (data && data.loading) {
      return <div className={classes.container}><Loader /></div>
    }

    const tanks = sortTanks(fuelTypeList, data.stationTanksWithList.currentTanks)

    return (
      <div className={classes.container}>
        <Paper className={classes.dataContainer}>
          <Typography
              className={classes.title}
              gutterBottom
              variant="title"
          >Current Tanks</Typography>
          <div className={classes.headerRow}>
            <div className={classes.headerCell}>ID</div>
            <div className={classes.headerCell}>Fuel Type</div>
            <div className={classes.headerCell}>Size</div>
            <div className={classes.headerCell}>Active</div>
          </div>
          <div>
            <Mutation
                mutation={TOGGLE_ACTIVE_MUTATION}
                onCompleted={this.handleUpdateComplete}
            >
              {(toggleActive, { loading, error }) => (
                <div>
                  {tanks.map(t => (
                    <div
                        className={classNames(classes.dataRow, {[classes.rowInactive]: !t.active})}
                        key={t.id}
                        onClick={() => {
                          toggleActive({
                            variables: this.setToggleVars(t),
                            refetchQueries: [{query: TANK_QUERY, variables: {stationID}}],
                          })
                        }}
                    >
                      <div className={classes.dataCell}>{t.tankID}</div>
                      <div className={classes.dataCell}>{t.fuelType}</div>
                      <div className={classes.dataCell}>{t.tank.size}</div>
                      <div className={classes.dataCell}>
                        <Checkbox
                            checked={t.active}
                            classes={{root: classes.checkboxRoot}}
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
  classes:    PropTypes.object.isRequired,
  data:       PropTypes.object,
  history:    PropTypes.object.isRequired,
  location:   PropTypes.object.isRequired,
  match:      PropTypes.object.isRequired,
  stationID:  PropTypes.string.isRequired,
}

const styles =  theme => ({
  checkboxRoot: {
    padding: 0,
    height: 10,
  },
  container: {
    display:        'flex',
    flexDirection:  'column',
    marginTop:      theme.spacing.unit * 3,
    width:          400,
  },
  dataCell: {
    flex: 1,
  },
  dataContainer: {
    display:        'flex',
    flexDirection:  'column',
  },
  dataRow: {
    borderBottom:       'solid 1px',
    borderBottomColor:  theme.palette.grey['300'],
    display:            'flex',
    flexDirection:      'row',
    padding:            theme.spacing.unit * 2,
    '&:hover': {
      backgroundColor:  theme.palette.grey['100'],
      cursor:           'pointer',
    },
  },
  errorMsg: {
    borderBottom: 'none',
    paddingLeft:  theme.spacing.unit,
    height:       40,
  },
  headerRow: {
    borderBottomColor:  '#efefef',
    borderBottomStyle:  'solid',
    borderBottomWidth:  1,
    color:              theme.palette.grey['700'],
    display:            'inline-flex',
    flexDirection:      'row',
    padding:            theme.spacing.unit,
  },
  headerCell: {
    flex:       1,
    fontWeight: '500',
    padding:    theme.spacing.unit,
  },
  rowInactive: {
    opacity: .5,
  },
  submitButton: {
    margin:     theme.spacing.unit * 2,
    marginLeft: 0,
  },
  table: {
    minWidth: 400,
    width:    500,
  },
  title: {
    paddingLeft:        theme.spacing.unit * 2,
    paddingTop:        theme.spacing.unit * 2,
  },
})

// todo: should be able to combine these next to HOC's with "compose"
const  StationTanksHO = withRouter(withStyles(styles)(StationTanks))

export default graphql(TANK_QUERY, {
  skip: props => !props.stationID,
  options: props => {
    return ({
      variables: {
        stationID: props.stationID,
      },
    })
  },
})(StationTanksHO)
