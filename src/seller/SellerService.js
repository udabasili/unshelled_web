import { getDb } from '../utils/db.js'

export default async function updateSeller (sellerId, updatedData) {
  const db = getDb()

  const sellers = db.collection('sellers')

  const filter = { seller_id: sellerId }
  const query = {
    $set: {
      seller_city: updatedData.sellerCity,
      seller_state: updatedData.sellerState
    }
  }
  const response = await sellers.findOneAndUpdate(filter, query, {
    new: true
  })
  return response
}
