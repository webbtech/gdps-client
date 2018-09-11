import React from 'react'
import PropTypes from 'prop-types'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'


const QUERY = gql`
  query Stations {
    stations {
      id
      name
    }
  }
`

class StationSelector extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.props.onStationChange(e.target.value)
  }

  render() {

    const { data, stationID } = this.props

    if (data.loading) return <p>Loading...</p>
    if (data.error) return <p>Error :(</p>

    return (
      <div>
        <InputLabel htmlFor="station-select">Station</InputLabel>
        <Select
            inputProps={{
              name: 'stationID',
              id: 'station-select',
            }}
            onChange={this.handleChange}
            style={{minWidth: 110}}
            value={stationID}
        >
          {data.stations && data.stations.map(({ id, name }) => (
            <MenuItem
                key={id}
                value={id}
            >{name}</MenuItem>
          ))}
        </Select>
      </div>
    )
  }
}

StationSelector.propTypes = {
  data:             PropTypes.object.isRequired,
  onStationChange:  PropTypes.func.isRequired,
  stationID:        PropTypes.string,
}

export default graphql(QUERY)(StationSelector)
