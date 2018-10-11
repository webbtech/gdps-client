import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { withRouter } from 'react-router'

import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'

import StationTanks from './StationTanks'


class StationInfo extends Component {

  constructor(props) {
    super(props)
    this.onHandleShowForm = this.onHandleShowForm.bind(this)
  }

  state = {
    stationID: '',
    showForm: false,
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

  onHandleShowForm = () => {
    this.setState(prevState => ({ showForm: !prevState.showForm}))
  }

  renderTanks = () => {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="h6"
        >Tanks</Typography>
        <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Fuel Type</TableCell>
            <TableCell numeric>Size</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {mockTanks.map((t, i) => (
          <TableRow key={i}>
            <TableCell>{t.id}</TableCell>
            <TableCell>{t.fuelType}</TableCell>
            <TableCell numeric>{t.size}</TableCell>
          </TableRow>
        ))}
        </TableBody>
        </Table>
        <Button
            className={classes.submitButton}
            color="primary"
            onClick={() => this.onHandleShowForm()}
        >
          Modify Station Tanks
        </Button>
      </div>
    )
  }

  render() {

    if (!this.state.stationID) return null

    return (
      <div>
      {this.state.showForm ? <StationTanks /> : this.renderTanks()}
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
    margin: theme.spacing.unit,
    marginLeft: theme.spacing.unit * 5,
  },
  submitButton: {
    margin: theme.spacing.unit * 2,
  },
  table: {
    minWidth: 400,
    width: 500,
  },
})

const mockTanks = [
  {id: '18', fuelType: 'NL', size: 75523},
  {id: '19', fuelType: 'SNL', size: 20252},
  {id: '5E', fuelType: 'DSL', size: 25000},
]

export default withRouter(withStyles(styles)(StationInfo))
