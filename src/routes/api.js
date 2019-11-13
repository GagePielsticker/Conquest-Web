// The minimum prediction confidence.
const toxicity = require('@tensorflow-models/toxicity')

const express = require('express')
const router = express.Router()

/**
 * Api Homepage Rendering
 */
router.get('/', (req, res) => {
  res.send('api unavailable')
})

/**
 * Handles Image Uploading (sharex)
 */
const fs = require('fs')
const pname = require('project-name-generator')
const multer = require('multer')
const mtr = multer()

router.post('/upload', mtr.any(), async (req, res) => {
  if (req.body.key != 'nutt1y') return res.status(404).json({ error: 'Not Found nErd.' })
  const tCheck = req.files[0].originalname.split('.')[1]
  if (tCheck != 'png' && tCheck != 'gif' && tCheck != 'jpg' && tCheck != 'jpeg' && tCheck != 'webp') { return res.status(500).json({ error: 'Not a valid image format (png/gif/jpg/jpeg/webp)' }) }
  const type = tCheck || 'png'
  const path = `${pname.generate({ words: 2, number: true }).dashed}.${type}`
  fs.writeFile(`./src/public/upload/${path}`, req.files[0].buffer, (err) => {
    if (err) return res.status(500).json({ error: 'Server error.' })
    return res.status(200).send(`https://conquestsim.io/upload/${path}`)
  })
})

async function loadML () {
  toxicity.load(0.9)
    .then((model) => {
      console.log('loaded ai')
      router.get('/toxic', async (req, res) => {
        const sentence = req.query.sentence
        model.classify(sentence).then(predictions => {
          res.json(predictions)
        })
      })
    })
}

loadML()

module.exports = router
