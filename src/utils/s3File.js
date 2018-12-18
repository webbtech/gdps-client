
import AWS from 'aws-sdk'

const bucketName = 'gdps-tank-files-srcbucket-1b4usmv6ms16v'
const bucketRegion = 'ca-central-1'
const IdentityPoolId = 'us-east-1:9fef8114-2894-4d3d-a060-46e72a50a479'

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId,
  }, {
    region: 'us-east-1',
  }),
})

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: bucketName },
})

export default async function uploadTankFile(file, fileName) {
  const retMsg = {
    error: '',
    success: '',
    fileData: {},
  }

  if (!file) {
    retMsg.error = 'Missing file'
    return retMsg
  }
  if (!fileName) {
    retMsg.error = 'Missing fileName'
    return retMsg
  }

  const fileKey = `${fileName}`
  const params = {
    Key: fileKey,
    Body: file,
  }
  await s3.upload(params).promise()
    .then((data) => {
      retMsg.success = 'File sucessfully updloaded'
      retMsg.fileData = data
    })
    .catch((err) => {
      retMsg.error = `An error occured uploading file: ${err.message}`
    })

  return retMsg
}
