import React from 'react'
import PropTypes from 'prop-types'

import { Auth } from 'aws-amplify'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import LogRocket from 'logrocket'

import AccountCircle from '@material-ui/icons/AccountCircle'
import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuIcon from '@material-ui/icons/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { LOGROCKET_ID } from '../../config/constants'


// function Header(props) {
class Header extends React.Component {
  constructor(props) {
    super(props)
    this.handleCloseMainMenu = this.handleCloseMainMenu.bind(this)
    this.handleCloseProfileMenu = this.handleCloseProfileMenu.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
    this.handleMainMenu = this.handleMainMenu.bind(this)

    this.state = {
      auth: true,
      anchorEl: null,
      menuEl: null,
      selectedIndex: this.props.history.location.pathname,
      user: '',
    }
  }

  componentDidMount = () => {
    Auth.currentUserInfo()
    // Auth.currentAuthenticatedUser()
      .then((user) => {
      // console.log('user in componentDidMount: ', user.attributes)
        this.setState({ user: user.attributes })
        if (user) {
          LogRocket.init(LOGROCKET_ID)
          const id = user.username

          LogRocket.identify(id, {
            name: user.attributes.name,
            email: user.attributes.email,
            environment: 'prod',
          })
        }
      })
    .catch(err => console.log(err)) // eslint-disable-line
  }

  handleChange = (event, checked) => {
    this.setState({ auth: checked })
  }

  handleProfileMenu = (event) => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleCloseProfileMenu = () => {
    this.setState({ anchorEl: null })
  }

  handleMainMenu = (event) => {
    this.setState({ menuEl: event.currentTarget })
  }

  handleCloseMainMenu = () => {
    this.setState({ menuEl: null })
  }

  handleNavigate = (url) => {
    this.props.history.push(url)
    this.setState(() => ({ selectedIndex: url, menuEl: null }))
  }

  handleLogout = () => {
    Auth.signOut()
      .then(() => {
      // this.props.history.push('/')
      // window.open('/')
        window.location.replace('/')
      })
    .catch(err => console.error(err)) // eslint-disable-line
  }

  render() {
    const { classes } = this.props
    const {
      auth, anchorEl, menuEl, selectedIndex, user,
    } = this.state
    const open = Boolean(anchorEl)
    const openMenu = Boolean(menuEl)

    return (
      <div className={classes.root}>
        <AppBar
          color="secondary"
          position="static"
        >
          <Toolbar>
            <IconButton
              aria-label="Menu"
              className={classes.menuButton}
              color="inherit"
              onClick={e => this.handleMainMenu(e)}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={menuEl}
              id="main-menu"
              onClose={this.handleCloseMainMenu}
              open={openMenu}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
            >
              {menuItems.map(m => (
                <MenuItem
                  disabled={m.uri === selectedIndex}
                  key={m.uri}
                  onClick={() => this.handleNavigate(m.uri)}
                  selected={m.uri === selectedIndex}
                >{m.label}
                </MenuItem>
              ))}
            </Menu>
            <Typography
              className={classes.flex}
              color="inherit"
              variant="h6"
            >
              <Link
                className={classes.titleLink}
                to="/"
              >Gales Dips
              </Link>
            </Typography>
            {auth && (
              <div>
                {user.name}
                <IconButton
                  aria-haspopup="true"
                  aria-owns={open ? 'menu-appbar' : null}
                  color="inherit"
                  onClick={e => this.handleProfileMenu(e)}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  id="menu-appbar"
                  onClose={() => this.handleCloseProfileMenu()}
                  open={open}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                >
                  <MenuItem onClick={() => this.props.history.push('/profile')}>Profile</MenuItem>
                  <MenuItem onClick={() => this.handleLogout()}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    fontFamily: theme.typography.fontFamily,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  titleLink: {
    textDecoration: 'none',
    color: '#fff',
  },
})

const menuItems = [
  { uri: '/', label: 'Dashboard' },
  { uri: '/dips', label: 'Dip Entries' },
  { uri: '/reports', label: 'Reports' },
  { uri: '/propane', label: 'Propane Entries' },
  { uri: '/import-data', label: 'Import Sales Data' },
  { uri: '/admin', label: 'Administration' },
]

export default withRouter(withStyles(styles)(Header))
