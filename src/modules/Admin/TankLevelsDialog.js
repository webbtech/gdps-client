import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { fmtNumber } from '../../utils/utils'

class TankLevelsDialog extends Component {
  state = {
    open: false,
  }

  handleClickOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { classes, tank } = this.props

    const levels = []
    for (const l in tank.levels) {
      levels.push({
        level: tank.levels[l].level,
        litres: tank.levels[l].litres,
      })
    }

    return (
      <div>
        <Button
          className={classes.openButton}
          color="secondary"
          onClick={this.handleClickOpen}
          variant="outlined"
        >Levels
        </Button>
        <Dialog
          aria-labelledby="scroll-dialog-title"
          onClose={this.handleClose}
          open={this.state.open}
          scroll={this.state.scroll}
        >
          <DialogTitle id="scroll-dialog-title">Tank Levels for tank id: {tank.id}</DialogTitle>
          <DialogContent>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell numeric>Level (cm)</TableCell>
                  <TableCell numeric>Litres</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {levels.map(l => (
                  <TableRow key={l.level}>
                    <TableCell numeric>{l.level}</TableCell>
                    <TableCell numeric>{fmtNumber(l.litres, 0, true)}</TableCell>
                  </TableRow>
            ))}
              </TableBody>
            </Table>
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              onClick={this.handleClose}
            >
            Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}
TankLevelsDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  tank: PropTypes.object.isRequired,
}

const styles = () => ({
  openButton: {
    float: 'right',
  },
})

export default withStyles(styles)(TankLevelsDialog)
