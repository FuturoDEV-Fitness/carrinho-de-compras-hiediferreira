const {Router} = require('express')
const ProductController = require('../controllers/ProductController')

const productRoutes = new Router()

productRoutes.post('/', ProductController.cadastrar)
productRoutes.get('/', ProductController.listarTodos)
productRoutes.get('/:id', ProductController.listarUm)

module.exports = productRoutes