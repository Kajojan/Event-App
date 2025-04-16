const express = require('express')
const router = express.Router()
const qr = require('qrcode')
const Jimp = require('jimp')

router.get('/', async (req, res) => {
  try {
    const { email, name, event, seat } = req.query.data
    const data = `Witamy na Wydarzeniu ${event}. Uczestnik: ${name}, Email:  ${email}, Zarezerwowane miejsce: ${seat}`
    const logoPath = './Logo.png'

    const qrCodeBuffer = await qr.toBuffer(data, { errorCorrectionLevel: 'H' })

    const qrCodeImage = await Jimp.read(qrCodeBuffer)
    const logoImage = await Jimp.read(logoPath)

    qrCodeImage.resize(550, 550)
    logoImage.resize(qrCodeImage.bitmap.width / 4, Jimp.AUTO)

    qrCodeImage.composite(
      logoImage,
      (qrCodeImage.bitmap.width - logoImage.bitmap.width) / 2,
      (qrCodeImage.bitmap.height - logoImage.bitmap.height) / 2
    )

    const qrWithLogoBase64 = await qrCodeImage.getBase64Async(Jimp.MIME_PNG)
    res.send({ qrCodeBase64: qrWithLogoBase64 })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Wystąpił błąd podczas generowania obrazu z kodem QR i logo' })
  }
})

module.exports = router
