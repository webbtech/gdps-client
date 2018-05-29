import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import Typography from '@material-ui/core/Typography'

import { withStyles } from '@material-ui/core/styles'

//fixme: this should be a pure component
class DipOverShort extends Component {

  render() {

    const { classes } = this.props

    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="title"
        >Overshort</Typography>
        <div className={classes.headerRow}>
          <div className={classes.headerCell}>Fuel Type</div>
          <div className={classNames([classes.headerCell], [classes.alignRight])}>Dip Litres</div>
          <div className={classNames([classes.headerCell], [classes.alignRight])}>Sale Litres</div>
          <div className={classNames([classes.headerCell], [classes.alignRight])}>Over/Short</div>
        </div>
        {mockOSs.map(os => (
          <div
              className={classes.dataRow}
              key={os.id}
          >
            <div className={classes.dataCell}>{os.fuelType}</div>
            <div className={classNames([classes.dataCell], [classes.alignRight])}>{fmtNumber(os.litres, 3)}</div>
            <div className={classNames([classes.dataCell], [classes.alignRight])}>{fmtNumber(os.sale, 3)}</div>
            <div className={classNames([classes.dataCell], [classes.alignRight], {[classes.negative]: os.overshort < 0})}>{fmtNumber(os.overshort, 3)}</div>
          </div>
        ))}
      </div>
    )
  }
}

DipOverShort.propTypes = {
  classes:  PropTypes.object.isRequired,
}

const styles =  theme => ({
  alignRight: {
    textAlign: 'right',
  },
  alignCenter: {
    textAlign: 'center',
  },
  container: {
    display:        'flex',
    flexDirection:  'column',
    fontFamily:     theme.typography.fontFamily,
    marginLeft:     theme.spacing.unit * 6,
    width:          theme.spacing.unit * 55,
  },
  dataCell: {
    alignSelf:      'flex-end',
    flex:           1,
    padding:        theme.spacing.unit,
    // paddingBottom:  theme.spacing.unit * 2,
  },
  dataRow: {
    borderBottomColor:  '#efefef',
    borderBottomStyle:  'solid',
    borderBottomWidth:  1,
    display:            'inline-flex',
    flexDirection:      'row',
    '&:hover': {
      backgroundColor: theme.palette.grey['50'],
    },
  },
  headerRow: {
    borderBottomColor:  '#efefef',
    borderBottomStyle:  'solid',
    borderBottomWidth:  1,
    display:            'inline-flex',
    flexDirection:      'row',
    paddingBottom:      4,
  },
  headerCell: {
    color:      theme.palette.secondary.main,
    flex:       1,
    fontWeight: '500',
    padding:    theme.spacing.unit,
  },
  negative: {
    color: 'red',
  },
})

const mockOSs = [
  {
    id: '678',
    fuelType: 'DSL',
    litres: 286.000,
    sale: 250.990,
    overshort: -35.010,
  },
  {
    id: '123',
    fuelType: 'NL',
    litres: 7208.000,
    sale: 5486.0550334,
    overshort: -1721.945,
  },
  {
    id: '345',
    fuelType: 'SNL',
    litres: 0,
    sale: 232.1742089,
    overshort: 232.175,
  },
]

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
const fmtNumber = (number, decimal = 2) => {
  if (number === undefined) return
  const formatter = new Intl.NumberFormat('en-US', {
    // style: 'currency',
    // currency: 'USD',
    useGrouping: false,
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal,
  })
  return formatter.format(number)
}

export default withStyles(styles)(DipOverShort)
