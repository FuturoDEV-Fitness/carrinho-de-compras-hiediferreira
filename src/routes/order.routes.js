const {Router} = require('express')
const OrderController = require('../controllers/OrderController')

const orderRoutes = new Router()

orderRoutes.post('/', OrderController.cadastrar)

module.exports = orderRoutes