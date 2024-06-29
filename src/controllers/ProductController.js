const {Pool} = require('pg')

const conexao = new Pool({
    host: 'localhost',  //onde está o banco de dados
    port: 5432,         //Padrão
    user: 'postgres',
    password: 'futuroDev',
    database: 'Mini_projeto'  //nome do banco de dados
})

class ProductController{
    async cadastrar(request, response){
        try {
            const dados = request.body

            if(!dados.name || !dados.id_categ){ 
                //se não foi informado o nome
                return response.status(400).json({mensagem: 'Nome e id_categ são campos obrigatórios!'})
            }

            const product =  await conexao.query(`
                INSERT INTO products (id_categ, name, amount, color, voltage, description, price)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                returning *
                `, [dados.id_categ, dados.name, dados.amount, dados.color, dados.voltage, dados.description, dados.price]
            )

            response.status(201).json(product.rows[0])
        } catch {
            response.status(500).json({mensagem: 'Não foi possível cadastrar...'})
        }
    }

    async listarTodos(request, response){
        try{
            const filtro = request.query
            if(filtro.filtro){
                const produto = await conexao.query(`
                    SELECT * FROM products
                    where nome ilike $1
                `, [`%${filtro.filtro}%`])
                response.json(produto.rows)
            } else{
                const produto = await conexao.query(`
                    SELECT * FROM products
                `)
                response.json(produto.rows)
            }
        }
        catch{
            response.status(500).json({mensagem: 'Não foi possível'})
        }
    }
}

module.exports = new ProductController