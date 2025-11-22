const getAtualizacoes = async () => {
    const res = await fetch("/adm/get-atualizacoes");
    const atualizacoes = await res.json();
    return atualizacoes;
}

// Cria um card reutilizando estilos existentes
function createUpdateCard({ _id, titulo, descricao }) {
    const card = document.createElement('div');
    card.className = 'service-card';
    card.dataset.id = _id || '';

    card.innerHTML = `
        <div class="service-content">
            <h3>${titulo}</h3>
            <p>${descricao}</p>
            <div class="update-actions">
                <button type="button" class="btn" data-action="editar" data-id="${_id}">Editar</button>
                <button type="button" class="btn" data-action="excluir" data-id="${_id}">Excluir</button>
            </div>
        </div>
    `;
    return card;
}

// Renderiza todos os cards
function renderUpdates(lista) {
    const grid = document.getElementById('updatesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    lista.forEach(item => grid.appendChild(createUpdateCard(item)));
}

// ===== Modal =====
const modalOverlay = document.getElementById('modalAtualizacao');
const formModal = document.getElementById('formModalAtualizacao');
const tituloInput = document.getElementById('modalTituloInput');
const descInput = document.getElementById('modalDescricaoInput');

function abrirModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    tituloInput.focus();
}

function fecharModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    formModal.reset();
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    const atualizacoes = await getAtualizacoes();
    renderUpdates(atualizacoes);

    const btnNova = document.getElementById('btnNovaAtualizacao');
    if (btnNova) {
        btnNova.addEventListener('click', abrirModal);
    }

    const btnFechar = document.getElementById('btnFecharModal');
    if (btnFechar) {
        btnFechar.addEventListener('click', fecharModal);
    }

    const btnCancelar = document.getElementById('btnCancelarModal');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', fecharModal);
    }

    // Fechar ao clicar fora do modal
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) fecharModal();
        });
    }

    // Escape fecha modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay?.classList.contains('active')) {
            fecharModal();
        }
    });
});

// Exports (opcional)
window.renderUpdates = renderUpdates;
window.createUpdateCard = createUpdateCard;
window.abrirModalAtualizacao = abrirModal;
window.fecharModalAtualizacao = fecharModal;