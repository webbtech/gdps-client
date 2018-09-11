import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { sortBy } from 'lodash'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'

import Loader from '../Common/Loader'

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


const TankList = ({ classes, formFunc }) => (
  <Query query={TANKLIST_QUERY}>

    {({ loading, error, data }) => {
      if (error) return `Error!: ${error}`
      if (loading)
        return <div className={classes.container}><Loader /></div>

      const tanks = sortBy(data.tankList, [t => t.id])
      return (
        <Paper className={classes.listContainer}>
          <Typography
              className={classes.title}
              gutterBottom
              variant="subheading"
          >
            Tank List
          </Typography>
          <TankListHeading classes={classes} />
          {tanks.map(t => (
            <div
                className={classes.listRow}
                key={t.id}
                onClick={() => formFunc(t.id)}
            >
              <div className={classes.listCellSmall}>{t.id}</div>
              <div className={classes.listCellSmall}>{t.size}</div>
              <div className={classes.listCell}>{t.model}</div>
              <div className={classes.listCell}>{t.description}</div>
              <div className={classes.listCell}>{t.status}</div>
            </div>
          ))}
        </Paper>
      )
    }}
  </Query>
)
TankList.propTypes = {
  classes:    PropTypes.object.isRequired,
  formFunc:   PropTypes.func.isRequired,
}

const TankListHeading = ({ classes }) => (
  <div className={classes.headerRow}>
    <div
        className={classes.headerCell}
        style={{flex: .5}}
    >ID</div>
    <div className={classes.headerCell}>Capacity</div>
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

    // put AppBar here
    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="title"
        >Tank Administration</Typography>
        <div style={{textAlign: 'right'}}>
        <Button
            className={classes.createButton}
            color="secondary"
            component={Link}
            to="/admin/tank-form"
            type="submit"
            variant="outlined"
        >
          Create Tank
        </Button>
        </div>
        <TankList
            classes={classes}
            formFunc={this.handleGoToForm}
        />
      </div>
    )
  }
}
TankAdmin.propTypes = {
  classes:  PropTypes.object.isRequired,
  history:  PropTypes.object.isRequired,
  // location: PropTypes.object.isRequired,
  // match:    PropTypes.object.isRequired,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    margin:         'auto',
    width:          700,
  },
  createButton: {
    marginBottom: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 2,
    width: '50%',
    // textAlign: 'right',
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
  title: {
    padding:      theme.spacing.unit,
    paddingLeft:  theme.spacing.unit * 2,
  },
})

export default withStyles(styles)(TankAdmin)