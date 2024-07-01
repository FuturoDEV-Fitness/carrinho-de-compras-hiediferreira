const {Pool} = require('pg')

const conexao = new Pool({
    host: 'localhost',  //onde está o banco de dados
    port: 5432,         //Padrão
    user: 'postgres',
    password: 'futuroDev',
    database: 'Mini_projeto'  //nome do banco de dados
})

class OrderController{
    async cadastrar(request, response){
        try {
            const dados = request.body

            if(!dados.id_client){ 
                //se não foi informado o nome
                return response.status(400).json({mensagem: 'id_client é um campo obrigatório!'})
            }

            let total = 0

            for(let i = 0; i < dados.produtos.length; i++){
                const item = dados.produtos[i]; //onde esté o array de produtos, informando o id do produto e a quantidade
 
                const produtoAtual = await conexao.query(`
                    SELECT price FROM products
                    where id_prod = $1`, [item.product_id]
                );

                console.log(produtoAtual.rows[0])

                total = total + (produtoAtual.rows[0].price * item.amount)
                console.log(total)
            }

            // Inserindo na tabela orders
            const carrinho =  await conexao.query(`
                INSERT INTO orders (id_client, total, address, observations)
                VALUES ($1, $2, $3, $4)
                returning *
                `, [dados.id_client, total, dados.address, dados.observation]
            )

            response.status(201).json(carrinho.rows[0])

            //inserindo na tabela orders_items
            dados.produtos.forEach(async item => {
                const produtoAtual2 = await conexao.query(`
                    SELECT price FROM products
                    where id_prod = $1`, [item.product_id]
                )

                conexao.query(`
                    INSERT INTO orders_items (id_order, id_product, amount, price)
                    VALUES ($1, $2, $3, $4)
                    returning *`,
                    [carrinho.rows[0].id_order, item.product_id, item.amount, produtoAtual2.rows[0].price]
                )
            })

        } catch {
            response.status(500).json({mensagem: 'Não foi possível cadastrar...'})
        }
    }
}

module.exports = new OrderController