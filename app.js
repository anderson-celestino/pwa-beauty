document.getElementById('btn-carregar').addEventListener('click', () => {
    const divResultado = document.getElementById('resultado');
    divResultado.classList.remove('hidden');
    divResultado.innerHTML = '<p style="text-align: center; width: 100%;">Buscando categorias e produtos...</p>';

    const urlAPI = 'http://192.168.1.127/wp-json/wc/store/products';

    fetch(urlAPI)
        .then(resposta => {
            if (!resposta.ok) throw new Error('Erro ao conectar com o WordPress');
            return resposta.json();
        })
        .then(produtos => {
            divResultado.innerHTML = ''; 
            
            if (produtos.length === 0) {
                divResultado.innerHTML = '<p>Nenhum produto cadastrado na loja.</p>';
                return;
            }

            const produtosPorCategoria = {};

            produtos.forEach(produto => {
                if (!produto.categories || produto.categories.length === 0) {
                    if (!produtosPorCategoria["Outros"]) produtosPorCategoria["Outros"] = [];
                    produtosPorCategoria["Outros"].push(produto);
                } else {
                    produto.categories.forEach(categoria => {
                        if (!produtosPorCategoria[categoria.name]) {
                            produtosPorCategoria[categoria.name] = [];
                        }
                        produtosPorCategoria[categoria.name].push(produto);
                    });
                }
            });

            for (const [nomeCategoria, listaProdutos] of Object.entries(produtosPorCategoria)) {
                
                divResultado.innerHTML += `<h3 class="titulo-categoria">${nomeCategoria}</h3>`;
                
                let gradeHtml = '<div class="grade-categoria">';

                listaProdutos.forEach(produto => {
                    const imagemUrl = produto.images && produto.images.length > 0 ? produto.images[0].src : 'https://via.placeholder.com/150';
                    const preco = produto.prices && produto.prices.price ? (produto.prices.price / Math.pow(10, produto.prices.currency_minor_unit)).toFixed(2) : '0.00';

                    gradeHtml += `
                        <div class="card">
                            <img src="${imagemUrl}" alt="${produto.name}">
                            <div class="card-info">
                                <h2>${produto.name}</h2>
                                <p class="preco">R$ ${preco}</p>
                            </div>
                        </div>
                    `;
                });

                gradeHtml += '</div>';
                divResultado.innerHTML += gradeHtml;
            }
        })
        .catch(erro => {
            console.error('Falha ao buscar produtos: ', erro);
            divResultado.innerHTML = '<p style="color: red; text-align: center; width: 100%;">Erro ao buscar os dados. Verifique sua conexão.</p>';
        });
});