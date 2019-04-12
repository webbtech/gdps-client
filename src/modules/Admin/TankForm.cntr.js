/* eslint-disable no-underscore-dangle */
import * as Yup from 'yup'
import gql from 'graphql-tag'
import { compose, graphql } from 'react-apollo'
import { withFormik } from 'formik'

import TankForm from './TankForm'
import { TANKLIST_QUERY } from './TankAdmin'
import uploadTankFile from '../../utils/s3File'

// note: oddly this no longer works, uploadTankFile is undefined when called
/* async function LoadS3File() {
  // const { uploadTankFile } = await import('../../utils/s3File')
  const uploadTankFile = await import('../../utils/s3File')
  console.log('uploadTankFile in LoadS3File:', uploadTankFile)
  return uploadTankFile
} */

const TANK_QUERY = gql`
query Tank($id: String!) {
  tank(id: $id) {
    id
    description
    levels
    model
    size
    status
  }
}
`
const FetchTank = graphql(TANK_QUERY, {
  skip: ({ match }) => !match || !match.params.tankID,
  options: ({ match }) => ({
    variables: { id: match.params.tankID },
  }),
})

const CREATE_TANK_MUTATION = gql`
mutation CreateTank($fields: TankInput) {
  createTank(input: $fields) {
    id
    status
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
// see: https://medium.com/@cyberlight/adapting-and-testing-forms-components-with-query-and-mutation-from-react-apollo-2-1-x-5c3a2971efa
const UpdateTank = graphql(UPDATE_TANK_MUTATION, {
  props: ({ mutate }) => ({
    UpdateTank: fields => mutate({
      variables: { fields },
      errorPolicy: 'all',
    }),
  }),
  options: props => ({
    onCompleted: () => {
    // onCompleted: (result, errs) => {
      // console.log('result: ', result)
      props.history.push('/admin/tank-admin')
    },
    refetchQueries: [{ query: TANKLIST_QUERY }],
  }),
  errorPolicy: 'all',
})

const CreateTank = graphql(CREATE_TANK_MUTATION, {
  props: ({ mutate }) => ({
    CreateTank: fields => mutate({
      variables: { fields },
    }),
  }),
  options: props => ({
    onCompleted: () => {
    // onCompleted: (result, errs) => {
      props.history.push('/admin/tank-admin')
    },
    refetchQueries: [{ query: TANKLIST_QUERY }],
  }),
  errorPolicy: 'all',
})


const TankFormCntr = withFormik({
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    model: Yup.string()
      .max(32, 'Maximum number of characters is: 32')
      .nullable(),
    size: Yup.number()
      .required('Capacity value is required'),
    description: Yup.string()
      .max(128, 'Maximum number of characters is: 128')
      .nullable(),
  }),
  mapPropsToValues: ({ data }) => {
    if (data && data.tank) {
      return data.tank
    }
  },
  handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
    const isUpdate = !!values.id
    let file
    let graphqlReturn

    if (isUpdate) {
      delete values.__typename
      if (values.levelsFile) {
        file = values.levelsFile
        delete values.levelsFile

        // Check file type
        if (file.type !== 'text/csv') {
          setErrors({ levelsFile: 'Invalid file type, must be a .csv file' })
          setSubmitting(false)
          return
        }
      }

      try {
        graphqlReturn = await props.UpdateTank(values)
        if (graphqlReturn && graphqlReturn.errors) {
          setErrors({ graphql: graphqlReturn.errors[0].message })
          setSubmitting(false)
          return
        }
      } catch (error) {
        setErrors({ graphql: error.message })
        setSubmitting(false)
      }
      if (file && graphqlReturn) {
        // const uploadTankFile = await LoadS3File()
        const tankID = values.id
        const fileRet = await uploadTankFile(file, `tankFile_${tankID}.csv`)
        if (fileRet.error) {
          setErrors({ graphql: fileRet.error })
          setSubmitting(false)
        }
      }
    } else { // New tank
      if (values.levelsFile) {
        file = values.levelsFile
        delete values.levelsFile
        values.status = 'PENDING'
      }

      try {
        graphqlReturn = await props.CreateTank(values)
        if (graphqlReturn && graphqlReturn.errors) {
          setErrors({ graphql: graphqlReturn.errors[0].message })
          setSubmitting(false)
          return
        }
      } catch (error) {
        setErrors({ graphql: error.message })
        setSubmitting(false)
      }
      if (file && graphqlReturn) {
        const tankID = graphqlReturn.data.createTank.id
        // const uploadTankFile = await LoadS3File()
        const fileRet = await uploadTankFile(file, `tankFile_${tankID}.csv`)
        if (fileRet.error) {
          setErrors({ graphql: fileRet.error })
          setSubmitting(false)
        }
      }
    }
  },
  displayName: 'RoleForm',
})

export default compose(
  UpdateTank,
  CreateTank,
  FetchTank,
  TankFormCntr,
)(TankForm)
