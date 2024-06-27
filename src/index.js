const express = require('express')

const clientRoutes = require('./routes/clients.routes')

const app = express()
app.use(express.json()) 
app.use('/clients', clientRoutes)
app.listen(3000, () => {
    console.log('Servidor Online')
})