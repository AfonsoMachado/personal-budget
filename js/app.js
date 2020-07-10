
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    /**
     * Verifica se o usuario preencheu todos os dados
     */
    validardados() {
        for (const i in this) {
            // Caso algum dado não esteja preenchido, retorna false
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        // Caso não exista nenhum id, cria um id inicial
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    /**
    * Grava uma instância de Despesa dentro do
    * local storage do navegador, através de um JSON
    * 
    * @param {Despesa} despesa 
    */
    gravar(despesa) {
        
        // Atualizando o id da despesa a ser inserida
        let id = this.getProximoId()
        // Transformando o objeto despesa numa notação JSON
        localStorage.setItem(id, JSON.stringify(despesa))
        // Atualizando o id atual utilizado
        localStorage.setItem('id', id)
    }

    /**
     * Recupera os dados contidos no localstorage
     * 
     * @returns {Array} Array com a lista de todas as despesas
     * 
     */
    recuperarTodosRegistros() {

        //Array de despesas
        let despesas = Array()

        // Quantidade de ids salvos
        let id = localStorage.getItem('id')

        // Recupera todoas as despesas cadastradas em localStorage
        for (let i = 1; i <= id; i++){
             let despesa = JSON.parse(localStorage.getItem(i))
             
             // Verifica se o indice foi removido
            if (despesa === null) {
                // Avança o laço para a iteração seguinte
                continue
            }

            // Adicionando o id no objeto despesa
            despesa.id = i
            despesas.push(despesa)   
        }
        return despesas
    }

    /**
     * Realiza busca de uma determinada despesa no banco de dados
     * 
     * @param {Despesa} despesa 
     * 
     * @returns Lista de despesas filtradas
     */
    pesquisar(despesa) {
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        
        // ----- Aplicando os filtros -----

        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        
        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }

        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }

        //descricao desconsiderando letra maiuscula
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao.toLowerCase().includes(despesa.descricao.toLowerCase()))
        }

        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    /**
     * Remove determinado item a partir da key, do localstorage
     * 
     * @param {String} id 
     */
    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

/**
 * recebe da aplicação os dados do formulário de cadastrar despesa
 */
function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    // Instanciando uma nova despesa
    const despesa = new Despesa(ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value)
    
    if (despesa.validardados()) {
        bd.gravar(despesa)

        // Gerando modal de alerta
        document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
        document.getElementById('modal_titulo_div').className = 'modal-header text-success'
        document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso'
        document.getElementById('modal_btn').innerHTML = 'Voltar'
        document.getElementById('modal_btn').className = 'btn btn-success'
        
        // dialog de sucesso
        $('#modalRegistraDespesa').modal('show')

        // resetando os campos do formulario
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        // Gerando modal de alerta
        document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
        document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
        document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente'
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
        document.getElementById('modal_btn').className = 'btn btn-danger'
        
        // dialog de erro
        $('#modalRegistraDespesa').modal('show')
    }

}

/**
 * Chamada sempre que houver um 'onload' no body
 * da parte de cosulta
 * 
 * @param {Array} despesas lista de despesas
 * @param {Boolean} filtro Indica se é um operação de filtragem ou nao
 */
function carregaListaDespesa(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()   
    }

    // Selecionando o elemento tbody da tabela de lista de despesas
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    // Porcorrer o array despesas, listando cada uma delas
    despesas.forEach(despesa => {
        // Cria uma tr (linha) na tabela
        let linha = listaDespesas.insertRow()

        // Criando colunas (td)
        linha.insertCell(0).innerHTML = `${despesa.dia}/${despesa.mes}/${despesa.ano}`
        
        // Ajustando o tipo
        switch (despesa.tipo) {
            case '1': despesa.tipo = 'Alimentação'
                break;
            case '2': despesa.tipo = 'Educação'
                break;
            case '3': despesa.tipo = 'Lazer'
                break;
            case '4': despesa.tipo = 'Saúde'
                break;
            case '5': despesa.tipo = 'Transporte'
                break;
        }

        linha.insertCell(1).innerHTML = despesa.tipo
        linha.insertCell(2).innerHTML = despesa.descricao
        linha.insertCell(3).innerHTML = despesa.valor

        // botão de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${despesa.id}`
        btn.onclick = function() {
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')
            //alert(id)
            bd.remover(id)

            // atualizando a pagina
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(despesa)
        
    })

}

function pesquisarDespesa() {
    // Capturando os dados inseridos no formulario
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesa(despesas, true)
    

}