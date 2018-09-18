import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import { graphql, Mutation } from 'react-apollo'

import classNames from 'classnames'

import Button from '@material-ui/core/Button'
import Delete from '@material-ui/icons/Delete'
import Input from '@material-ui/core/Input'
import Save from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import PropaneSelectors from './PropaneSelectors'
import { extractPathParts, dateToInt } from '../../utils/utils'


const DELIVERY_QUERY = gql`
query PropaneDelivery($date: Int!) {
  propaneDelivery(date: $date) {
    date
    litres
  }
}
`

const CREATE_DELIVERY = gql`
mutation CreatePropaneDelivery($fields: PropaneDeliverInput!) {
  createPropaneDelivery(input: $fields) {
    ok
    nModified
  }
}
`

const REMOVE_DELIVERY = gql`
mutation RemovePropaneDelivery($fields: PropaneRemoveDeliverInput!) {
  removePropaneDelivery(input: $fields) {
    ok
    nModified
  }
}
`

class PropaneForm extends Component {

  state = {
    litres: '',
  }

  componentDidUpdate = (prevProps) => {
    const { data, location } = this.props
    // When changing dates and no delivery, remove litres
    if (!data.propaneDelivery && location !== prevProps.location) {
      this.setState({litres: ''})
    }
    // First time we get delivery set litres
    if (prevProps.data && !prevProps.data.propaneDelivery && data.propaneDelivery) {
      this.setState({litres: data.propaneDelivery.litres})
    }
    // When moving between dates and we have deliver set litres
    if (prevProps.data && data.propaneDelivery && prevProps.data.propaneDelivery !== data.propaneDelivery) {
      this.setState({litres: data.propaneDelivery.litres})
    }
    /*if (location !== prevProps.location) {
      console.log('data.propaneDelivery: ', data.propaneDelivery)
    }*/
  }

  createDeliveryParams = () => {
    const prts = extractPathParts(this.props.location.pathname)
    if (!prts) return null
    const date = dateToInt(prts[0])
    if (!this.state.litres) return null
    return {
      fields: {
        date,
        litres: Number(this.state.litres),
      },
    }
  }

  handleChange = prop => event => {
    this.setState({ [prop]: parseInt(event.target.value, 10) })
  }

  removeDeliveryParams = () => {
    const prts = extractPathParts(this.props.location.pathname)
    if (!prts) return null
    const date = dateToInt(prts[0])
    if (!this.state.litres) return null
    return {
      fields: {
        date,
      },
    }
  }

  removeLitresState = () => {
    this.setState({litres: ''})
  }

  render() {

    const { classes } = this.props
    const { litres } = this.state

    return (
      <div className={classes.container}>
        <Typography
            gutterBottom
            variant="title"
        >Delivery</Typography>
        <PropaneSelectors />

        <div className={classes.dataRow}>
          <div className={classes.dataCell}>
            <Input
                autoFocus
                name="litres"
                onChange={this.handleChange('litres')}
                placeholder="Litres"
                type="number"
                value={litres}
            />
          </div>
          <Mutation
              mutation={REMOVE_DELIVERY}
              onCompleted={this.removeLitresState}
              variables={this.removeDeliveryParams()}
          >
            {(removeDelivery, { loading, error }) => (
              <div className={classNames([classes.dataCell], [classes.narrowCell])}>
                <Button
                    className={classes.delButton}
                    color="secondary"
                    disabled={!this.state.litres}
                    onClick={removeDelivery}
                >
                  <Delete style={{padding: 0}} />
                </Button>
                {loading && <div>Processing...</div>}
                {error && <div>Error :( Please try again</div>}
              </div>
            )}
          </Mutation>
        </div>

        <Mutation
            mutation={CREATE_DELIVERY}
            variables={this.createDeliveryParams()}
        >
          {(createDelivery, { loading, error }) => (
            <div>
              <Button
                  className={classes.submitButton}
                  color="primary"
                  disabled={!this.state.litres}
                  onClick={createDelivery}
                  variant="raised"
              >
                <Save className={classNames(classes.leftIcon, classes.iconSmall)} />
                Save Propane Delivery
              </Button>
              {loading && <div>Processing...</div>}
              {error && <div>Error :( Please try again</div>}
            </div>
          )}
        </Mutation>
      </div>
    )
  }
}

PropaneForm.propTypes = {
  classes:  PropTypes.object.isRequired,
  data:     PropTypes.object,
  location: PropTypes.object.isRequired,
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
    width:          theme.spacing.unit * 40,
    margin: 'auto',
  },
  dataCell: {
    alignSelf:      'flex-end',
    flex:           1,
    padding:        theme.spacing.unit,
    paddingBottom:  theme.spacing.unit * 2,
  },
  dataRow: {
    display:        'inline-flex',
    flexDirection:  'row',
  },
  delButton: {
    minWidth: 0,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  submitButton: {
    margin: theme.spacing.unit,
    marginTop: theme.spacing.unit * 3,
  },
})

const styledForm = withStyles(styles)(PropaneForm)

export default graphql(DELIVERY_QUERY, {
  skip: props => props.location.pathname.split('/').length <= 2,
  options: (props) => {
    const prts = extractPathParts(props.location.pathname)
    return ({
      variables: {
        date: prts ? dateToInt(prts[0]) : null,
      },
    })
  },
})(styledForm)
