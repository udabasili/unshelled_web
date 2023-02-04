import express from 'express'
import basicAuthentication from '../middleware/authentication.js'
import { deleteOrderById, getAllOrders } from './OrderService.js'

const router = express.Router()

router.get('/order_items', basicAuthentication, async function (req, res, next) {
  try {
    const page = req.query.page > 0 ? req.query.page : 1
    const sortBy = req.query.sortBy
    const response = await getAllOrders(page, sortBy)
    return res.status(200).json(response)
  } catch (error) {
    return next({
      status: error.status,
      message: error.message
    })
  }
})

router.delete('/order_items/:id', async function (req, res, next) {
  try {
    const orderId = req.params.id
    const deletedOrder = await deleteOrderById(orderId)
    return res.status(200).json({
      success: true,
      itemsDelete: deletedOrder
    })
  } catch (error) {
    return next(error)
  }
})

export default router
