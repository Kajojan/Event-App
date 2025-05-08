require('dotenv').config({
  path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env'
})
const express = require('express')
const multer = require('multer')

const { S3 } = require('@aws-sdk/client-s3')

const router = express.Router()

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },

  region: process.env.AWS_REGION,
})

const upload = multer({
  storage: multer.memoryStorage(),
})

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    if (file != null) {
      const key = `uploads/${Date.now()}_${file.originalname}`

      const params = {
        Bucket: 'serwis-y',
        Key: key,
        Body: file.buffer,
        acl: 'public-read',
      }

      await s3.putObject(params)

      const aclParams = {
        Bucket: 'serwis-y',
        Key: key,
        ACL: 'public-read',
      }

      await s3.putObjectAcl(aclParams)

      const s3Location = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`
      res.json({ success: true, result: s3Location })
    }
    res.send()
  } catch (error) {
    console.error('Error handling file upload:', error)
    res.status(500).json({ error: 'Error uploading file to S3' })
  }
})
const images = [
  'https://serwis-y.s3.eu-north-1.amazonaws.com/uploads/exampl1.jpg',
  'https://serwis-y.s3.eu-north-1.amazonaws.com/uploads/example2.jpg',
  'https://serwis-y.s3.eu-north-1.amazonaws.com/uploads/example3.jpg',
  'https://serwis-y.s3.eu-north-1.amazonaws.com/uploads/example4.jpg',
  'https://serwis-y.s3.eu-north-1.amazonaws.com/uploads/example5.jpg',
  'https://serwis-y.s3.eu-north-1.amazonaws.com/uploads/example6.jpeg',
]
router.get('/image', async (req, res) => {
  try {
    res.send(images)
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
