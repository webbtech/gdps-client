import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { sortBy } from 'lodash'

import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import red from '@material-ui/core/colors/red'
import green from '@material-ui/core/colors/lightGreen'
import yellow from '@material-ui/core/colors/yellow'

import Loader from '../Common/Loader'
import { fmtNumber } from '../../utils/utils'

export const TANKLIST_QUERY = gql`
query TankList {
  tankList {
    id
    description
    model
    size
    status
  }
}`


const TankList = ({ classes, formFunc }) => (
  <Query
      fetchPolicy="cache-and-network"
      pollInterval={5000}
      query={TANKLIST_QUERY}
  >

    {({ loading, error, data }) => {
      if (error) return `Error!: ${error}`
      if (loading) return <div className={classes.container}><Loader /></div>

      const tanks = sortBy(data.tankList, [t => t.id])
      return (
        <div className={classes.listContainer}>
          <TankListHeading classes={classes} />
          {tanks.map(t => (
            <div
                className={
                  classNames(
                    classes.listRow,
                    {[classes.statusOK]: t.status === 'OK'},
                    {[classes.statusPending]: t.status === 'PENDING'},
                    {[classes.statusProcessing]: t.status === 'PROCESSING'}
                  )
                }
                key={t.id}
                onClick={() => formFunc(t.id)}
            >
              <div className={classes.listCellSmall}>{t.id}</div>
              <div className={classes.listCellSmall}>{fmtNumber(t.size, 0, true)}</div>
              <div className={classes.listCell}>{t.model}</div>
              <div className={classes.listCell}>{t.description}</div>
              <div className={classes.listCell}>{t.status}</div>
            </div>
          ))}
        </div>
      )
    }}
  </Query>
)
TankList.propTypes = {
  classes:    PropTypes.object.isRequired,
  formFunc:   PropTypes.func.isRequired,
}

const TankListHeading = ({ classes }) => (
  <div className={classNames(classes.headerRow, classes.listBox)}>
    <div className={classNames(classes.headerCell, classes.listCellSmall)}>ID</div>
    <div className={classNames(classes.headerCell, classes.listCellSmall)}>Capacity</div>
    <div className={classes.headerCell}>Model</div>
    <div className={classes.headerCell}>Description</div>
    <div className={classes.headerCell}>Status</div>
  </div>
)
TankListHeading.propTypes = {
  classes:    PropTypes.object.isRequired,
}

class TankAdmin extends Component {

  handleGoToForm = tankID => {
    const { history } = this.props
    const uri = `/admin/tank-form/${tankID}`
    history.push(uri)
  }

  render() {

    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="headline"
        >Tank Administration</Typography>
        <Paper className={classes.listContainer}>
          <AppBar
              color="default"
              position="static"
          >
            <Toolbar>
              <Typography
                  className={classes.title}
                  gutterBottom
                  variant="title"
              >
              Tank Listing
              </Typography>
              <Button
                  color="secondary"
                  component={Link}
                  to="/admin/tank-form"
                  variant="outlined"
              >Create Tank</Button>
            </Toolbar>
          </AppBar>
          <TankList
              classes={classes}
              formFunc={this.handleGoToForm}
          />
        </Paper>
      </div>
    )
  }
}
TankAdmin.propTypes = {
  classes:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    margin:         'auto',
    width:          700,
  },
  headerRow: {
    borderBottom:       'solid 1px',
    borderBottomColor:  theme.palette.grey['300'],
    color:              theme.palette.grey['700'],
    display:            'flex',
    flexDirection:      'row',
    paddingBottom:      theme.spacing.unit,
    paddingLeft:        theme.spacing.unit * 2,
    paddingRight:       theme.spacing.unit * 2,
  },
  headerCell: {
    flex: 1,
  },
  listBox:{
    marginTop: theme.spacing.unit * 2,
  },
  listContainer: {
    display:        'flex',
    flexDirection:  'column',
  },
  listRow: {
    borderBottom:       'solid 1px',
    borderBottomColor:  theme.palette.grey['300'],
    cursor:             'pointer',
    display:            'flex',
    flexDirection:      'row',
    padding:            theme.spacing.unit,
    paddingLeft:        theme.spacing.unit * 2,
    paddingRight:       theme.spacing.unit * 2,
    '&:hover': {
      backgroundColor: theme.palette.grey['100'],
    },
  },
  listCell: {
    flex: 1,
  },
  listCellSmall: {
    flex: .5,
  },
  statusOK: {
    backgroundColor: green[50],
  },
  statusError: {
    backgroundColor: red[150],
  },
  statusPending: {
    backgroundColor: red[50],
  },
  statusProcessing: {
    backgroundColor: yellow[50],
  },
  title: {
    flexGrow: 1,
  },
})

export default withStyles(styles)(TankAdmin)