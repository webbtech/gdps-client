import React from 'react'
import PropTypes from 'prop-types'

import Divider from '@material-ui/core/Divider'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Header from '../Header/Header'
import ImportForm from './ImportForm'
import { styles as ms } from '../../styles/main'


function ImportData({ classes }) {
  return (
    <div>
      <Header />
      <Paper className={classes.paper}>
        <Typography
          gutterBottom
          variant="h5"
        >
          Import Sales Data
        </Typography>
        <Divider /><br />
        <ImportForm />
      </Paper>
    </div>
  )
}
ImportData.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
}

export default withStyles(ms)(ImportData)
