import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'
import { Manager, Reference, Popper } from 'react-popper'
import { withRouter } from 'react-router'

import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'

import { withStyles } from '@material-ui/core/styles'
import { styles as ms } from '../../styles/main'

const setButtonColor = (pathname, searchPath) => (pathname.indexOf(searchPath) >= 0 ? 'primary' : 'default')


class ReportMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openMenu1: false,
      openMenu2: false,
      openMenu3: false,
      openMenuDwnld: false,
    }
    this.handleClose = this.handleClose.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleLink = this.handleLink.bind(this)
  }


  handleClose() {
    // if (this.target1.contains(event.target) || this.target2.contains(event.target)) {
    //   return
    // }
    this.setState({ openMenu1: false })
    this.setState({ openMenu2: false })
    this.setState({ openMenu3: false })
    this.setState({ openMenuDwnld: false })
  }

  handleToggle(menu) {
    this.handleClose()
    this.setState({ [menu]: !this.state[menu] })
  }

  handleLink(uri) {
    const { match } = this.props
    this.handleClose()
    this.props.history.push(`${match.url}${uri}`)
  }


  render() {
    const { classes } = this.props
    const {
      openMenu1, openMenu2, openMenu3, openMenuDwnld,
    } = this.state
    const { pathname } = this.props.history.location

    return (

      <div style={{ display: 'inline-flex', flexDirection: 'row' }}>
        {/* Start Fuel Sales Menu */}
        <div style={{ flex: 'flex-grow' }}>
          <Manager>
            <Reference>
              {() => (
                <div
                  ref={(node) => {
                    this.target1 = node
                  }}
                >
                  <Button
                    color={setButtonColor(pathname, '/fuel-sales')}
                    onClick={() => this.handleToggle('openMenu1')}
                  >
                  Fuel Sales
                  </Button>
                </div>
              )}
            </Reference>
            <Popper
              eventsEnabled={openMenu1}
              placement="bottom-start"
            >
              {() => (
                <ClickAwayListener onClickAway={this.handleClose}>
                  <Grow
                    className={classNames({ [classes.popperClose]: !openMenu1 })}
                    id="menu1"
                    in={openMenu1}
                    style={{ transformOrigin: '0 0 0', position: 'absolute', zIndex: 1 }}
                  >
                    <Paper>
                      <MenuList role="menu">
                        <MenuItem onClick={() => this.handleLink('/fuel-sales-detailed')}>Station Details</MenuItem>
                        <MenuItem onClick={() => this.handleLink('/fuel-sales-list')}>Station List</MenuItem>
                      </MenuList>
                    </Paper>
                  </Grow>
                </ClickAwayListener>
              )}
            </Popper>
          </Manager>
        </div>
        {/* End Fuel Sales Menu */}

        {/* Start Fuel Deliveries Button */}
        <div style={{ flex: 'flex-grow' }}>
          <Button
            color={setButtonColor(pathname, '/fuel-deliveries')}
            onClick={() => this.handleLink('/fuel-deliveries')}
          >
            Fuel Deliveries
          </Button>
        </div>
        {/* End Fuel Deliveries Button */}

        {/* Start Overshort Menu */}
        <div style={{ flex: 'flex-grow' }}>
          <Manager>
            <Reference>
              {() => (
                <div ref={(node) => { this.target2 = node }}>
                  <Button
                    color={setButtonColor(pathname, '/overshort-')}
                    onClick={() => this.handleToggle('openMenu2')}
                  >
                Over-short
                  </Button>
                </div>
              )}
            </Reference>
            <Popper
              eventsEnabled={openMenu2}
              placement="bottom"
            >
              {() => (
                <ClickAwayListener onClickAway={this.handleClose}>
                  <Grow
                    className={classNames({ [classes.popperClose]: !openMenu2 })}
                    id="menu2"
                    in={openMenu2}
                    style={{ transformOrigin: '0 0 0', position: 'absolute', zIndex: 1 }}
                  >
                    <Paper>
                      <MenuList role="menu">
                        <MenuItem onClick={() => this.handleLink('/overshort-monthly')}>Monthly</MenuItem>
                        <MenuItem onClick={() => this.handleLink('/overshort-annually')}>Annual</MenuItem>
                      </MenuList>
                    </Paper>
                  </Grow>
                </ClickAwayListener>
              )}
            </Popper>
          </Manager>
        </div>
        {/* End Overshort Menu */}

        {/* Start Propane Sales Menu */}
        <div style={{ flex: 'flex-grow' }}>
          <Manager>
            <Reference>
              {() => (
                <div ref={(node) => { this.target3 = node }}>
                  <Button
                    color={setButtonColor(pathname, '/propane-sales-')}
                    onClick={() => this.handleToggle('openMenu3')}
                  >
                  Propane Sales
                  </Button>
                </div>
              )}
            </Reference>
            <Popper
              eventsEnabled={openMenu3}
              placement="bottom-start"
            >
              {() => (
                <ClickAwayListener onClickAway={this.handleClose}>
                  <Grow
                    className={classNames({ [classes.popperClose]: !openMenu3 })}
                    id="menu1"
                    in={openMenu3}
                    style={{ transformOrigin: '0 0 0', position: 'absolute', zIndex: 1 }}
                  >
                    <Paper>
                      <MenuList role="menu">
                        <MenuItem onClick={() => this.handleLink('/propane-sales-monthly')}>Monthly</MenuItem>
                        <MenuItem onClick={() => this.handleLink('/propane-sales-annual')}>Annual</MenuItem>
                      </MenuList>
                    </Paper>
                  </Grow>
                </ClickAwayListener>
              )}
            </Popper>
          </Manager>
        </div>
        {/* End Propane Sales Menu */}

        {/* Start Report Downloads Menu */}
        <div style={{ flex: 'flex-grow' }}>
          <Manager>
            <Reference>
              {() => (
                <div ref={(node) => { this.target4 = node }}>
                  <Button
                    color={setButtonColor(pathname, '/report-download-')}
                    onClick={() => this.handleToggle('openMenuDwnld')}
                  >
                  Report Downloads
                  </Button>
                </div>
              )}
            </Reference>
            <Popper
                // className={classNames({ [classes.popperClose]: !openMenuDwnld })}
              eventsEnabled={openMenuDwnld}
              placement="bottom-start"
            >
              {() => (
                <ClickAwayListener onClickAway={this.handleClose}>
                  <Grow
                    className={classNames({ [classes.popperClose]: !openMenuDwnld })}
                    id="menu1"
                    in={openMenuDwnld}
                    style={{ transformOrigin: '0 0 0', position: 'absolute', zIndex: 1 }}
                  >
                    <Paper>
                      <MenuList role="menu">
                        <MenuItem onClick={() => this.handleLink('/report-download-station')}>Station Report</MenuItem>
                        <MenuItem onClick={() => this.handleLink('/report-download-propane')}>Propane Sales</MenuItem>
                        <MenuItem onClick={() => this.handleLink('/report-download-fuelsalesum')}>Fuel Sales Summary</MenuItem>
                      </MenuList>
                    </Paper>
                  </Grow>
                </ClickAwayListener>
              )}
            </Popper>
          </Manager>
        </div>
        {/* End Report Downloads Menu */}

      </div>
    )
  }
}

ReportMenu.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  history: PropTypes.instanceOf(Object).isRequired,
  match: PropTypes.instanceOf(Object).isRequired,
}

export default withRouter(withStyles(ms)(ReportMenu))
