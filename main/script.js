let opcoes = [];

function exibirCaixaDialogo() {
    const opcao = prompt('Digite uma opção:');
    if (opcao) {
        opcoes.push(opcao);
        atualizarOpcoes();
    }
}

function atualizarOpcoes() {
    const opcoesContainer = document.getElementById('opcoes-container');
    opcoesContainer.innerHTML = '';

    opcoes.forEach(opcao => {
        const opcaoDiv = document.createElement('div');
        opcaoDiv.className = 'opcao';
        opcaoDiv.textContent = opcao;
        opcoesContainer.appendChild(opcaoDiv);
    });
}

function realizarSorteio() {
    const resultadoElemento = document.getElementById('resultado');
    
    if (opcoes.length < 2) {
        resultadoElemento.textContent = 'É necessário fornecer pelo menos duas opções.';
        return;
    }

    const opcaoSorteada = opcoes[Math.floor(Math.random() * opcoes.length)];
    resultadoElemento.textContent = 'A opção sorteada é: ' + opcaoSorteada;
}