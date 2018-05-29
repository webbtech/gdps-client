import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'
import { Manager, Reference, Popper } from 'react-popper'


import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'

import { withStyles } from '@material-ui/core/styles'
import { styles as ms } from '../../styles/main'

class ReportMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      openMenu1: false,
      openMenu2: false,
      openMenu3: false,
    }
    this.handleClose  = this.handleClose.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.handleLink   = this.handleLink.bind(this)
  }

  handleClose() {
    // if (this.target1.contains(event.target) || this.target2.contains(event.target)) {
    //   return
    // }
    this.setState({ openMenu1: false })
    this.setState({ openMenu2: false })
    this.setState({ openMenu3: false })
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

  setButtonColor(pathname, searchPath) {
    return (pathname.indexOf(searchPath) >= 0) ? 'primary' : 'default'
  }

  render() {

    const { classes } = this.props
    const { openMenu1, openMenu2, openMenu3 } = this.state
    const { pathname } = this.props.history.location

    return (

      <div style={{display: 'inline-flex', flexDirection: 'row'}}>
      {/* Start Fuel Sales Menu */}
        <div style={{flex: 'flex-grow'}}>
          <Manager>
            <Reference>
              {() => (
              <div
                  ref={node => {
                    this.target1 = node
                  }}
              >
                <Button
                    color={this.setButtonColor(pathname, '/fuel-sales')}
                    onClick={() => this.handleToggle('openMenu1')}
                >
                  Fuel Sales
                </Button>
              </div>
              )}
            </Reference>
            <Popper
                className={classNames({ [classes.popperClose]: !openMenu1 })}
                eventsEnabled={openMenu1}
                placement="bottom-start"
            >
              {() => (
              <ClickAwayListener onClickAway={this.handleClose}>
                <Grow
                    id="menu1"
                    in={openMenu1}
                    style={{ transformOrigin: '0 0 0', position: 'absolute', zIndex: 999 }}
                >
                  <Paper>
                    <MenuList role="menu">
                      <MenuItem onClick={() => this.handleLink('/fuel-sales-weekly')}>Weekly</MenuItem>
                      <MenuItem onClick={() => this.handleLink('/fuel-sales-monthly')}>Monthly</MenuItem>
                    </MenuList>
                  </Paper>
                </Grow>
              </ClickAwayListener>
              )}
            </Popper>
          </Manager>
        </div>
      {/* End Fuel Sales Menu */}

        <div style={{flex: 'flex-grow'}}>
          <Button
              color={this.setButtonColor(pathname, '/fuel-deliveries')}
              onClick={() => this.handleLink('/fuel-deliveries')}
          >
            Fuel Deliveries
          </Button>
        </div>

      {/* Start Overshort Menu */}
        <div style={{flex: 'flex-grow'}}>
          <Manager>
            <Reference>
              {() => (
              <div
                  ref={node => {
                    this.target2 = node
                  }}
              >
              <Button
                  color={this.setButtonColor(pathname, '/overshort-')}
                  onClick={() => this.handleToggle('openMenu2')}
              >
                Over-short
              </Button>
              </div>
              )}
            </Reference>
            <Popper
                className={classNames({ [classes.popperClose]: !openMenu2 })}
                eventsEnabled={openMenu2}
                placement="bottom"
            >
              {() => (
              <ClickAwayListener onClickAway={this.handleClose}>
                <Grow
                    id="menu2"
                    in={openMenu2}
                    style={{ transformOrigin: '0 0 0', position: 'absolute', zIndex: 999 }}
                >
                  <Paper>
                    <MenuList role="menu">
                      <MenuItem onClick={() => this.handleLink('/overshort-daily')}>Daily</MenuItem>
                      <MenuItem onClick={() => this.handleLink('/overshort-monthly')}>Monthly</MenuItem>
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
        <div style={{flex: 'flex-grow'}}>
          <Manager>
            <Reference>
              {() => (
              <div
                  ref={node => {
                    this.target3 = node
                  }}
              >
                <Button
                    color={this.setButtonColor(pathname, '/propane-sales-')}
                    onClick={() => this.handleToggle('openMenu3')}
                >
                  Propane Sales
                </Button>
              </div>
              )}
            </Reference>
            <Popper
                className={classNames({ [classes.popperClose]: !openMenu3 })}
                eventsEnabled={openMenu3}
                placement="bottom-start"
            >
              {() => (
              <ClickAwayListener onClickAway={this.handleClose}>
                <Grow
                    id="menu1"
                    in={openMenu3}
                    style={{ transformOrigin: '0 0 0', position: 'absolute', zIndex: 999 }}
                >
                  <Paper>
                    <MenuList role="menu">
                      <MenuItem onClick={() => this.handleLink('/propane-sales-weekly')}>Weekly</MenuItem>
                      <MenuItem onClick={() => this.handleLink('/propane-sales-monthly')}>Monthly</MenuItem>
                    </MenuList>
                  </Paper>
                </Grow>
              </ClickAwayListener>
              )}
            </Popper>
          </Manager>
        </div>
      {/* End Propane Sales Menu */}

      </div>
    )
  }
}

ReportMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}

export default withStyles(ms)(ReportMenu)
