import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import { withApollo } from 'react-apollo'
import { compose } from 'react-apollo'
import { Field, reduxForm } from 'redux-form'

import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import {
    required,
    RenderFileField,
    RenderTextField,
} from '../Common/FormFields'


const TANK_QUERY = gql`
query Tank($id: String!) {
  tank(id: $id) {
    id
    description
    model
    size
    status
  }
}
`
const fetchTank = graphql(TANK_QUERY, {
  skip: ({ match }) => !match || !match.params.tankID,
  options: ({ match }) => ({
    variables: {id: match.params.tankID},
  }),
})

const CREATE_TANK_MUTATION = gql`
mutation CreateTank($fields: TankInput) {
  createTank(input: $fields) {
    id
  }
}
`

const UPDATE_TANK_MUTATION = gql`
mutation UpdateTank($fields: TankInput) {
  updateTank(input: $fields) {
    id
    description
    model
    status
  }
}
`

/*const onError = (({ networkError, graphQLErrors }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log( // eslint-disable-line
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations, null, 2)}, Path: ${path}`,
      )
    )
  }
  if (networkError) console.log(`[Network error]: ${networkError}`) // eslint-disable-line
})*/

// see: https://medium.com/@cyberlight/adapting-and-testing-forms-components-with-query-and-mutation-from-react-apollo-2-1-x-5c3a2971efa
const updateTankMutation = graphql(UPDATE_TANK_MUTATION, {
  props: ({ mutate }) => ({
    updateTankM: (fields) => mutate({
      variables: {fields},
      errorPolicy: 'all',
  }),
  }),
  options: (props) => ({
    // onError: onError,
    onCompleted: (result, errs) => {
      console.log('result in onCompleted: ', result)
      console.log('errs in onCompleted: ', errs)
    },
    onError: (errors) => {
      console.log('errors: ', errors)
    },
    /*onError: ({ networkError, graphQLErrors }) => {
      console.log('networkError in onError: ', networkError)
      console.log('graphQLErrors in onError: ', graphQLErrors)
      return {error: 'stupid error'}
    },*/
  }),
  errorPolicy: 'all',
})

class TankForm extends Component {

  state = {
    editMode: false,
    tankID: '',
  }

  componentDidUpdate = (prevProps, prevState) => {

    const { data, initialize, initialized, match} = this.props
    if (match.params.tankID && !prevState.tankID) {
      this.setState(() => ({tankID: match.params.tankID, editMode: true}))
    }

    if (data && data.loading === false && !initialized) {
      initialize(data.tank)
    }
  }

  onHandleSubmit = (values) => {
    console.log('values: ', values)
    delete values.__typename
    delete values.id
    this.props.updateTankM(values)
    .then(() => {
    // .then(({ data }) => {
      // console.log('got data', data)
      // this.handleDipComplete()
    })
    .catch(e => {
      const errors = e.graphQLErrors || []
      const error = errors.map(err => err.message).join('\n')
      console.log('err: ', e)
      // setSubmitting(false);
      // setErrors({ name: error })
    })
    /*.catch((error) => {
      const errMsg = `There was an error sending the query: ${error}`
      console.log('errMsg: ', errMsg)
      // this.props.actions.errorSend({message: errMsg, type: 'danger'})
    })*/
  }

  render() {

    console.log('props in render: ', this.props)

    const formTitle = this.state.editMode ? 'Edit Tank Info' : 'Enter Tank Info'
    const {
      classes,
      handleSubmit,
      match,
      pristine,
      submitting,
    } = this.props

    return (
      <Paper className={classes.container}>
        <Typography
            gutterBottom
            variant="title"
        >{formTitle}</Typography>
        <form
            className={classes.form}
            onSubmit={handleSubmit(this.onHandleSubmit)}
        >
          <input type='hidden' id='tankID' value={match.params.tankID} />
          <Field
              className={classes.field}
              component={RenderTextField}
              id="model"
              label="Model"
              name="model"
          />
          <Field
              className={classes.field}
              component={RenderTextField}
              id="size"
              label="Capacity"
              name="size"
              required
              type="number"
              validate={required}
          />
          <Field
              className={classes.field}
              component={RenderTextField}
              id="description"
              label="Description"
              name="description"
          />
          <Field
              accept="text/*"
              className={classes.field}
              component={RenderFileField}
              id="levelsFile"
              label="Levels File"
              name="levelsFile"
              // required
              type="file"
              // validate={required}
          />
          <Button
              className={classes.submitButton}
              color="primary"
              disabled={pristine || submitting}
              type="submit"
              variant="raised"
          >
          Submit
        </Button>
        </form>
      </Paper>
    )
  }
}
TankForm.propTypes = {
  classes:      PropTypes.object.isRequired,
  data:         PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  initialize:   PropTypes.func.isRequired,
  initialized:  PropTypes.bool.isRequired,
  match:        PropTypes.object.isRequired,
  pristine:     PropTypes.bool,
  submitting:   PropTypes.bool,
}

const styles =  theme => ({
  container: {
    display:        'flex',
    flexDirection:  'column',
    padding:      theme.spacing.unit * 2,
    margin: 'auto',
    width:          400,
  },
  fileField: {
    color: '#000666',
  },
  field: {
    flex: 1,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
  form: {
    dispay: 'flex',
    flexDirection: 'column',
  },
  submitButton: {
    flex: 1,
    marginTop: theme.spacing.unit * 2,
    width: '100%',
  },
})

export default compose(
  reduxForm({
    form: 'tankForm',
  }),
  withStyles(styles),
  withApollo,
  updateTankMutation,
  fetchTank
)(TankForm)
