import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { Query } from 'react-apollo'
import { sortBy } from 'lodash'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'

import Loader from '../Common/Loader'
import { fmtNumber } from '../../utils/utils'
import { FUEL_TYPE_LIST as fuelTypes } from '../../config/constants'
import { TANK_QUERY } from './StationTanks.cntr'

const TANKLIST_QUERY = gql`
query TankList {
  tankList {
    id
    description
    model
    size
    status
  }
}`

const CREATE_TANK_MUTATION = gql`
mutation CreateStationTank($fields: StationTankInput) {
  createStationTank(input: $fields) {
    ok
    nModified
  }
}
`

class TankDialog extends Component {

  state = {
    fuelType: '',
    open: false,
    openConfirm: false,
    selectedTank: '',
  }

  handleClickOpen = () => {
    this.setState({open: true})
  }

  handleOpenConfirm = () => {
    this.setState({openConfirm: true})
  }

  handleOkConfirm = () => {
    this.setState({openConfirm: false, fuelType: ''})
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleCloseConfirm = () => {
    this.setState({ openConfirm: false, fuelType: '' })
  }

  handleSelectTank = (e, tankID) => {
    this.setState(() => ({ open: false, selectedTank: tankID }), this.handleOpenConfirm)
  }

  handleSelectFuelType = (e, value) => {
    this.setState({ fuelType: value })
  }

  setCreateFields = () => {
    return {
      fields: {
        fuelType:   this.state.fuelType,
        stationID:  this.props.stationID,
        tankID:     this.state.selectedTank,
      },
    }
  }

  render() {

    const { classes, stationID } = this.props

    return (
      <div>
        <Button
            color="secondary"
            disabled={!stationID}
            onClick={this.handleClickOpen}
            variant="outlined"
        >Add Tank</Button>
        <Dialog
            aria-labelledby="scroll-dialog-title"
            onClose={this.handleClose}
            open={this.state.open}
            scroll={this.state.scroll}
        >
          <DialogTitle id="scroll-dialog-title">Select New Tank</DialogTitle>
          <Query query={TANKLIST_QUERY}>

            {({ loading, error, data }) => {
              if (error) return `Error!: ${error}`
              if (loading) return <div className={classes.container}><Loader /></div>

              const tanks = sortBy(data.tankList, [t => t.id])
              return (
                <DialogContent>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell numeric>Capacity</TableCell>
                        <TableCell>Model</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {tanks.map(t => (
                      <TableRow
                          hover
                          key={t.id}
                          onClick={e => this.handleSelectTank(e, t.id)}
                          // role="checkbox"
                      >
                        <TableCell>{t.id}</TableCell>
                        <TableCell numeric>{fmtNumber(t.size, 0, true)}</TableCell>
                        <TableCell>{t.model}</TableCell>
                      </TableRow>
                    ))}
                    </TableBody>
                  </Table>
                </DialogContent>
              )
            }}
          </Query>

          <DialogActions>
            <Button
                color="primary"
                onClick={this.handleClose}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
            aria-describedby="alert-dialog-description"
            aria-labelledby="alert-dialog-title"
            onClose={this.handleCloseConfirm}
            open={this.state.openConfirm}
        >
          <DialogTitle id="alert-dialog-title">Select Fuel Type and Confirm</DialogTitle>
          <DialogContent>
            <div className={classes.msg}>NOTE: This action cannot be reversed.<br />Please ensure all details are accurate.</div>
            <RadioGroup
                aria-label="Ringtone"
                name="ringtone"
                onChange={this.handleSelectFuelType}
                ref={ref => {
                  this.radioGroupRef = ref
                }}
                value={this.state.fuelType}
            >
              {fuelTypes.map(option => (
                <FormControlLabel
                    control={<Radio />}
                    key={option}
                    label={option}
                    value={option}
                />
              ))}
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            
            <Mutation
                mutation={CREATE_TANK_MUTATION}
                onCompleted={this.handleOkConfirm}
                refetchQueries={[{query: TANK_QUERY, variables: {stationID}}]}
                variables={this.setCreateFields()}
            >
              {(toggleActive, { loading, error }) => (
                <div>
                  <Button
                      color="primary"
                      onClick={this.handleCloseConfirm}
                  >
                    Cancel
                  </Button>
                  <Button
                      color="primary"
                      disabled={!this.state.fuelType}
                      // onClick={this.handleOkConfirm}
                      onClick={toggleActive}
                  >
                    Confirm Add Tank
                  </Button>
                  <div className={classes.errorMsg}>
                    {loading && <div>Processing...</div>}
                    {error && <div>Error :( Please try again</div>}
                  </div>
                </div>
              )}
            </Mutation>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
TankDialog.propTypes = {
  classes:    PropTypes.object.isRequired,
  stationID:  PropTypes.string.isRequired,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    margin:         'auto',
    width:          700,
  },
  errorMsg: {
    fontFamily:     theme.typography.fontFamily,
    fontWeight:     500,
    height:         40,
  },
  msg: {
    fontFamily:     theme.typography.fontFamily,
  },
})

export default withStyles(styles)(TankDialog)
