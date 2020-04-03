const vm = new Vue({
    el: '#app',
    data: {
        produtos: [],
        produto: false,
        carrinho: [],
        mensagemAlerta: "Item Adicionado",
        alertaAtivo: false
    },
    methods: {
        fetchProdutos() {
            fetch('./api/produtos.json')
                .then(response => response.json())
                .then(response => {
                    this.produtos = response;
                })
        },
        fetchProduto(id) {
            fetch(`./api/produtos/${id}/dados.json`)
                .then(response => response.json())
                .then(response => {
                    this.produto = response;
                })
        },
        abrirModal(id) {
            this.fetchProduto(id);
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            })
        },
        fecharModal({ target, currentTarget }) {
            if (target === currentTarget) this.produto = false;
        },
        adicionarItem() {
            this.produto.estoque--;
            const { id, nome, preco } = this.produto;
            this.carrinho.push({ id, nome, preco });
            this.alerta(`${nome} adicionado ao carrinho.`);
        },
        removerItem(index) {
            this.carrinho.splice(index, 1);
        },
        checarLocalStorage() {
            if (window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho);
            }
        },
        alerta(mensagem) {
            this.mensagemAlerta = mensagem;
            this.alertaAtivo = true;
            setTimeout(() => {
                this.alertaAtivo = false;
            }, 1500);
        }
    },
    computed: {
        carrinhoTotal() {
            let total = 0;
            if (this.carrinho.length) {
                this.carrinho.forEach(item => {
                    total += item.preco;
                })
            }
            return total;
        }
    },
    watch: {
        carrinho() {
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },
    created() {
        this.fetchProdutos();
        this.checarLocalStorage();
    },
    filters: {
        numeroPreco(valor) {
            return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
    }
})