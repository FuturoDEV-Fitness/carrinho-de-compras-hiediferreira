const {Pool} = require('pg')

const conexao = new Pool({
    host: 'localhost',  //onde está o banco de dados
    port: 5432,         //Padrão
    user: 'postgres',
    password: 'futuroDev',
    database: 'Mini_projeto'  //nome do banco de dados
})

class ClientController{
    async cadastrar(request, response){
        try {
            const dados = request.body

            if(!dados.name || !dados.email || !dados.cpf || !dados.contact){
                //se nenhum desses campos forem informados
                return response.status(400).json({mensagem: 'Nome, email, cpf e contato são campos obrigatórios!'})
            }

            const testeNome = await conexao.query(`
                SELECT * from clients
                where name ilike $1`, [`%${dados.name}%`]
            )

            const testeEmail = await conexao.query(`
                SELECT * from clients
                where email ilike $1`, [`%${dados.email}%`]
            )

            const testeCpf = await conexao.query(`
                SELECT * from clients
                where cpf ilike $1`, [`%${dados.cpf}%`]
            )

            if(testeNome.rows.length > 0) {
                //se retornar maior que 1, então, encontrou correspondência no banco
                return response.status(404).json({
                    mensagem: 'Nome já existe!'
                })
            }

            if(testeEmail.rows.length > 0) {
                //se retornar maior que 1, então, encontrou correspondência no banco
                return response.status(404).json({
                    mensagem: 'E-mail já existe!'
                })
            }

            if(testeCpf.rows.length > 0) {
                //se retornar maior que 1, então, encontrou correspondência no banco
                return response.status(404).json({
                    mensagem: 'Cpf já existe!'
                })
            }

            const client =  await conexao.query(`
                INSERT INTO clients (name, email, cpf, contact)
                VALUES ($1, $2, $3, $4)
                returning *
                `, [dados.name, dados.email, dados.cpf, dados.contact]
            )

            response.status(201).json(client.rows[0])
        } catch {
            response.status(500).json({mensagem: 'Não foi possível cadastrar...'})
        }
    }
}

module.exports = new ClientController