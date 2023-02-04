import app from './src/app.js'
import config from 'config'
import { dbConnect } from './src/utils/db.js'

let PORT
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  PORT = config.get('port')
} else {
  PORT = process.env.PORT || 80
}

dbConnect(function (err) {
  if (err) {
    console.error(err)
    process.exit()
  }
})

app.listen(PORT, function () {
  console.log(`A Node Js API is listening on port: ${PORT}`)
})
