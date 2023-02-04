import supertest from 'supertest'
import { dbConnect } from '../src/utils/db'

let db;
let collection;

beforeAll(async () =>{
    db = await dbConnect()
   collection = db.collection('orders')
})

beforeEach(() => {
    collection.deleteMany({})
})  

describe('User Listing', () => {
    it('should show empty data by default', () => {
        
    })
})