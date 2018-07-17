import React, { Component } from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import { fmtNumber } from '../../utils/utils'

// fixme: I think this should be a pure component
class DipOverShort extends Component {

  render() {

    const { classes, data } = this.props

    let rows = []
    let haveData = false
    let fuelPrice
    let displayDate

    if (data && data.loading === false && data.dipOverShortRange && data.dipOverShortRange[1]) {
      haveData = true
      const os = data.dipOverShortRange[1].overShort
      for (const prop in os) {
        rows.push({
          fuelType:   os[prop].fuelType,
          litres:     os[prop].litres,
          overshort:  os[prop].overshort,
          sale:       os[prop].sale,
        })
      }
    }

    if (haveData && data.fuelPrice) {
      fuelPrice = fmtNumber(data.fuelPrice.price, 2)
      displayDate = this.props.dateObj.format('ddd, MMM Do')
    }

    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="title"
        >Overshort</Typography>
        {haveData &&
          <div className={classes.container}>
            <div className={classes.headerRow}>
              <div className={classes.headerCell}>Fuel Type</div>
              <div className={classNames([classes.headerCell], [classes.alignRight])}>Dip Litres</div>
              <div className={classNames([classes.headerCell], [classes.alignRight])}>Sale Litres</div>
              <div className={classNames([classes.headerCell], [classes.alignRight])}>Over/Short</div>
            </div>

            {rows.map((os, i) => (
              <div
                  className={classes.dataRow}
                  key={i}
              >
                <div className={classes.dataCell}>{os.fuelType}</div>
                <div className={classNames([classes.dataCell], [classes.alignRight])}>{fmtNumber(os.litres, 3)}</div>
                <div className={classNames([classes.dataCell], [classes.alignRight])}>{fmtNumber(os.sale, 3)}</div>
                <div className={classNames([classes.dataCell], [classes.alignRight], {[classes.negative]: os.overshort < 0})}>{fmtNumber(os.overshort, 3)}</div>
              </div>
            ))}
          </div>
        }
        {fuelPrice &&
        <div className={classes.fuelPrice}>
        <Typography
            gutterBottom
            variant="subheading"
        >Fuel Price: {fuelPrice} - ({displayDate})</Typography>
        </div>
        }
      </div>
    )
  }
}

DipOverShort.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
  dateObj:  PropTypes.object,
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
  fuelPrice: {
    marginTop: theme.spacing.unit * 2,
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

export default withStyles(styles)(DipOverShort)
