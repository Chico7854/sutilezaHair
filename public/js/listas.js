// Função simples para renderizar clientes
function renderClientes(clientes) {
    const container = document.querySelector('#clientes-container');
    container.innerHTML = '';
    
    clientes.forEach(cliente => {
        const card = document.createElement('div');
        card.className = 'info-card';
        card.innerHTML = `
            <h3>${cliente.nome}</h3>
            <p><strong>Email:</strong> ${cliente.email}</p>
            <p><strong>Telefone:</strong> ${cliente.telefone}</p>
        `;
        container.appendChild(card);
    });
}

// Função simples para renderizar admins
function renderAdmins(admins) {
    const container = document.querySelector('#admins-container');
    container.innerHTML = '';
    
    admins.forEach(admin => {
        const card = document.createElement('div');
        card.className = 'info-card admin-card';
        card.innerHTML = `
            <h3>${admin.nome}</h3>
            <p><strong>Email:</strong> ${admin.email}</p>
            <p><strong>Telefone:</strong> ${admin.telefone}</p>
        `;
        container.appendChild(card);
    });
}


async function getClientes() {
    const clientes = await fetch("/adm/lista-clientes");
    return clientes.json();
}

async function getAdms() {
    const adms = await fetch("/adm/lista-adms");
    return adms.json();
}

document.addEventListener("DOMContentLoaded", async () => {
    const clientes = await getClientes();
    // const adms = await getAdms();

    renderClientes(clientes);
    // renderAdmins(adms);
});