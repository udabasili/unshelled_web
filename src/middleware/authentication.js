import { checkPassword } from '../auth/AuthService.js'
import { getDb } from '../utils/db.js'

const basicAuthentication = async (req, _res, next) => {
  const authorization = req.headers.authorization
  try {
    if (authorization) {
      const db = getDb()
      const sellers = db.collection('sellers')
      const encoded = authorization.substring(6) // start from 6 characters from the beginning i.e basic + space
      const decoded = Buffer.from(encoded, 'base64').toString('ascii') // decoded the encrypted basic auth header
      const [sellerId, sellerZipCode] = decoded.split(':') // sellerId:sellerZipCode
      const seller = await sellers.findOne({
        seller_id: sellerId
      })
      if (!seller) {
        return next({
          status: 403,
          message: 'Authentication failed'
        })
      }
      const match = checkPassword(sellerZipCode, seller.seller_zip_code_prefix)
      if (!match) {
        return next({
          status: 403,
          message: 'Authentication failed'
        })
      }
      req.currentUser = seller
      return next()
    } else {
      return next({
        status: 403,
        message: 'Authentication failed'
      })
    }
  } catch (error) {
    return next({
      status: 403,
      message: 'Authentication failed'
    })
  }
}

export default basicAuthentication
