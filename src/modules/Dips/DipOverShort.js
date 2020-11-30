import React from 'react'
import PropTypes from 'prop-types'

import classNames from 'classnames'

import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import Loader from '../Common/Loader'
import { fmtNumber } from '../../utils/utils'
import { FUEL_TYPE_LIST as fuelTypeList } from '../../config/constants'

const DipOverShort = ({
  classes,
  dateObj,
  dips,
  isSubmit,
}) => {
  const rows = []
  let haveData = false
  let fuelPrice
  let displayDate

  if (dips && dips.loading === false && dips.dipOverShortRange && dips.dipOverShortRange[1]) {
    haveData = true
    const os = dips.dipOverShortRange[1].overShort

    // Sort by fuel type
    fuelTypeList.forEach((ft) => {
      if (os[ft]) {
        rows.push({
          fuelType: os[ft].fuelType,
          litres: os[ft].tankLitres,
          overshort: os[ft].overShort,
          sale: os[ft].litresSold,
        })
      }
    })
  }

  if (haveData && dips.fuelPrice) {
    fuelPrice = fmtNumber(dips.fuelPrice.price, 2)
    displayDate = dateObj.format('ddd, MMM Do')
  }

  return (
    <div className={classes.container}>
      <Typography
        gutterBottom
        variant="h6"
      >Overshort
      </Typography>
      {isSubmit && <Loader />}

      {haveData && !isSubmit &&
        <div className={classes.tblContainer}>
          <div className={classes.headerRow}>
            <div className={classes.headerCell}>Fuel Type</div>
            <div className={classNames([classes.headerCell], [classes.alignRight])}>
              Dip Litres
            </div>
            <div className={classNames([classes.headerCell], [classes.alignRight])}>
              Litres Sold
            </div>
            <div className={classNames([classes.headerCell], [classes.alignRight])}>
              Over/Short
            </div>
          </div>

          {rows.map((os, i) => (
            <div
              className={classes.dataRow}
              key={i} // eslint-disable-line react/no-array-index-key
            >
              <div className={classes.dataCell}>{os.fuelType}</div>
              <div className={classNames([classes.dataCell], [classes.alignRight])}>
                {fmtNumber(os.litres, 3, true)}
              </div>
              <div className={classNames([classes.dataCell], [classes.alignRight])}>
                {fmtNumber(os.sale, 3, true)}
              </div>
              <div className={classNames(
                [classes.dataCell],
                [classes.alignRight],
                { [classes.negative]: os.overshort < 0 }
                )}
              >
                {fmtNumber(os.overshort, 3)}
              </div>
            </div>
          ))}
        </div>
      }
      {fuelPrice &&
      <div className={classes.fuelPrice}>
        <Typography
          gutterBottom
          variant="subtitle1"
        >Fuel Price: {fuelPrice} - ({displayDate})
        </Typography>
      </div>
      }
    </div>
  )
}

DipOverShort.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  dateObj: PropTypes.instanceOf(Object),
  dips: PropTypes.instanceOf(Object),
  isSubmit: PropTypes.bool.isRequired,
}
DipOverShort.defaultProps = {
  dateObj: null,
  dips: null,
}

const styles = theme => ({
  alignRight: {
    textAlign: 'right',
  },
  alignCenter: {
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    marginLeft: theme.spacing.unit * 4,
  },
  dataCell: {
    alignSelf: 'flex-end',
    flex: 1,
    padding: theme.spacing.unit,
  },
  dataRow: {
    borderBottomColor: '#efefef',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'inline-flex',
    flexDirection: 'row',
    '&:hover': {
      backgroundColor: theme.palette.grey['50'],
    },
  },
  fuelPrice: {
    marginTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit,
  },
  headerRow: {
    borderBottomColor: '#efefef',
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'inline-flex',
    flexDirection: 'row',
    paddingBottom: 4,
  },
  headerCell: {
    color: theme.palette.secondary.main,
    flex: 1,
    fontWeight: '500',
    padding: theme.spacing.unit,
  },
  negative: {
    color: theme.palette.primary.main,
  },
  tblContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
})

export default withStyles(styles)(DipOverShort)
