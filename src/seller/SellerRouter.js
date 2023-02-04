import express from 'express'
import basicAuthentication from '../middleware/authentication.js'
import updateSeller from './SellerService.js'

const router = express.Router()

router.patch('/account', basicAuthentication, async function (req, res, next) {
  try {
    const currentUserId = req.currentUser.seller_id
    const updatedSellerData = await updateSeller(currentUserId, req.body)
    return res.status(200).json({
      updatedSellerData,
      success: true
    })
  } catch (error) {
    return next(error)
  }
})
export default router
