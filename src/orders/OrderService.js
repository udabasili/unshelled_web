import { getDb } from '../utils/db.js'

export async function deleteOrderById (orderId = '') {
  const db = getDb()
  const orders = db.collection('orders')
  console.log(orderId)
  const deletedOrder = await orders.deleteOne({
    order_item_id: orderId
  })
  return deletedOrder
}

export async function getAllOrders (page = 1, sortBy = 'shipping_limit_date') {
  const db = getDb()
  const orders = db.collection('orders')
  const total = await orders.estimatedDocumentCount()
  const limit = 20
  const offset = (page - 1) * limit
  const ordersData = await orders.find({}).skip(offset).sort(sortBy).limit(limit).toArray()
  const refactoredOrdersData = ordersData.map((order) => ({
    id: order.order_item_id,
    product_id: order.product_id,
    product_category: order.product_category_name,
    price: order.price,
    date: order.shipping_limit_date
  }))
  return {
    data: refactoredOrdersData,
    total,
    limit,
    offset
  }
}
