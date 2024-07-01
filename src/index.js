const express = require('express')

const clientRoutes = require('./routes/clients.routes')
const productRoutes = require('./routes/products.routes')
const orderRoutes = require('./routes/order.routes')

const app = express()
app.use(express.json()) 

app.use('/clients', clientRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.listen(3000, () => {
    console.log('Servidor Online')
})