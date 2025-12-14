// ===========================
// Configuração e Estado
// ===========================

let estado = {
    titulo: '',
    participantes: [],
    historico: [] 
};

const frasesParabens = [
    "Hoje a sorte sorriu para você! 🌟",
    "Olha só quem ganhou! 🏆",
    "Não foi manipulado, eu juro! 🤖",
    "Prepare-se, a vez é sua! 🚀",
    "O destino escolheu você! ✨",
    "A vitória é doce! 🍬",
    "Parabéns! Você foi o escolhido(a)! 🤩"
];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    renderizarLista();
    renderizarHistorico();
});

// ===========================
// Persistência
// ===========================

function salvarDados() {
    const inputTitulo = document.getElementById('tituloSorteio');
    estado.titulo = inputTitulo.value;
    localStorage.setItem('sorteioDados', JSON.stringify(estado));
    verificarBotao();
}

function carregarDados() {
    const dadosSalvos = localStorage.getItem('sorteioDados');
    if (dadosSalvos) {
        estado = { ...estado, ...JSON.parse(dadosSalvos) };
        document.getElementById('tituloSorteio').value = estado.titulo || '';
    }
}

// ===========================
// Gerenciamento de Participantes
// ===========================

function adicionarParticipante() {
    const input = document.getElementById('inputNome');
    const nome = input.value.trim();

    if (nome) {
        if(estado.participantes.includes(nome)) {
            alert("Este nome já está na lista!");
            input.focus();
            return;
        }
        estado.participantes.push(nome);
        input.value = '';
        input.focus();
        salvarDados();
        renderizarLista();
    }
}

function checarEnter(event) {
    if (event.key === 'Enter') adicionarParticipante();
}

function removerParticipante(index) {
    estado.participantes.splice(index, 1);
    salvarDados();
    renderizarLista();
}

function limparTudo() {
    if (confirm('ATENÇÃO: Isso apagará todos os participantes E O HISTÓRICO. Continuar?')) {
        estado.participantes = [];
        estado.historico = [];
        estado.titulo = '';
        document.getElementById('tituloSorteio').value = '';
        salvarDados();
        renderizarLista();
        renderizarHistorico();
    }
}

// ===========================
// Renderização
// ===========================

function renderizarLista() {
    const container = document.getElementById('opcoes-container');
    const contador = document.getElementById('contador');
    
    container.innerHTML = '';
    contador.textContent = `(${estado.participantes.length})`;

    if (estado.participantes.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum participante adicionado.</p>';
        verificarBotao();
        return;
    }

    estado.participantes.forEach((nome, index) => {
        const div = document.createElement('div');
        div.className = 'opcao-item';
        div.style.animationDelay = `${index * 0.05}s`;
        div.innerHTML = `
            <span style="font-weight: 500;">${nome}</span>
            <button class="btn-delete" onclick="removerParticipante(${index})" title="Remover">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(div);
    });
    
    container.scrollTop = container.scrollHeight;
    verificarBotao();
}

function renderizarHistorico() {
    const container = document.getElementById('historico-container');
    container.innerHTML = '';

    if (estado.historico.length === 0) {
        container.innerHTML = '<p class="empty-state">Nenhum sorteio realizado ainda.</p>';
        return;
    }

    [...estado.historico].reverse().forEach(item => {
        const tituloSorteio = item.titulo || 'Sorteio Rápido';

        const div = document.createElement('div');
        div.className = 'winner-item';
        div.innerHTML = `
            <i class="fas fa-trophy" style="color: var(--gold); font-size: 1.2rem;"></i>
            <div class="winner-info">
                <span class="winner-title">${tituloSorteio}</span>
                <span class="winner-name">🏆 ${item.nome}</span>
                <span class="winner-time">${item.data}</span>
            </div>
        `;
        container.appendChild(div);
    });
}

function verificarBotao() {
    const btn = document.getElementById('btnSortear');
    btn.disabled = estado.participantes.length < 2;
}

// ===========================
// Lógica Avançada de Sorteio (Crypto API)
// ===========================

// Função auxiliar que usa o hardware para gerar número aleatório
function gerarNumeroSeguro(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

function iniciarSorteio() {
    if (estado.participantes.length < 2) return;

    const modal = document.getElementById('modalResultado');
    const elAnimacao = document.getElementById('animacaoNomes');
    const elTitulo = document.getElementById('tituloResultado');
    const elFrase = document.getElementById('fraseParabens');

    const tituloSorteio = document.getElementById('tituloSorteio').value;
    elTitulo.innerText = tituloSorteio ? `Resultado: ${tituloSorteio}` : "O Vencedor é...";
    
    elFrase.style.opacity = '0';
    elAnimacao.classList.remove('animacao-vencedor');
    elAnimacao.style.color = '#ccc';
    modal.classList.add('visible');

    let contador = 0;
    const totalGiros = 25; 
    
    // Efeito visual de roleta
    const intervalo = setInterval(() => {
        // Usa random simples apenas para a animação visual (não afeta o resultado final)
        const indexVisual = Math.floor(Math.random() * estado.participantes.length);
        elAnimacao.innerText = estado.participantes[indexVisual];
        
        contador++;
        if (contador >= totalGiros) {
            clearInterval(intervalo);
            finalizarSorteio(elAnimacao, elFrase);
        }
    }, 80);
}

function finalizarSorteio(elNome, elFrase) {
    // 1. Obtém o último vencedor para evitar repetição imediata
    const ultimoVencedor = estado.historico.length > 0 ? estado.historico[estado.historico.length - 1].nome : null;
    let vencedorIndex;
    let vencedorNome;
    let tentativas = 0;

    // 2. Loop de Segurança: Tenta sortear alguém diferente do anterior
    // (Só funciona se houver mais de 1 pessoa na lista. Tenta 5 vezes antes de desistir)
    do {
        vencedorIndex = gerarNumeroSeguro(estado.participantes.length);
        vencedorNome = estado.participantes[vencedorIndex];
        tentativas++;
    } while (vencedorNome === ultimoVencedor && estado.participantes.length > 1 && tentativas < 5);

    const frase = frasesParabens[gerarNumeroSeguro(frasesParabens.length)];
    const tituloAtual = document.getElementById('tituloSorteio').value;

    // 3. Exibe Resultado
    elNome.innerText = vencedorNome;
    void elNome.offsetWidth; 
    elNome.classList.add('animacao-vencedor');
    
    elFrase.innerText = frase;
    elFrase.style.opacity = '1';
    elFrase.style.transition = 'opacity 1s ease 0.5s';

    dispararFogos();

    // 4. Salva
    const agora = new Date();
    estado.historico.push({
        nome: vencedorNome,
        titulo: tituloAtual,
        data: agora.toLocaleDateString() + ' às ' + agora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    
    salvarDados();
    renderizarHistorico();
}

function fecharModal() {
    document.getElementById('modalResultado').classList.remove('visible');
}

function dispararFogos() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);

        confetti(Object.assign({}, defaults, { 
            particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        confetti(Object.assign({}, defaults, { 
            particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
    }, 250);
}

document.getElementById('tituloSorteio').addEventListener('input', salvarDados);
document.addEventListener('keydown', (e) => { if(e.key === "Escape") fecharModal(); });