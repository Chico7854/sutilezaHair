// Função simples para renderizar agendamentos
function renderAgendamentos(agendamentos) {
    const container = document.querySelector('#agendamentos-container');
    container.innerHTML = '';
    
    agendamentos.forEach(agendamento => {
        let data = new Date(agendamento.data);
        data = data.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });

        console.log(data);
        const card = document.createElement('div');
        card.className = 'info-card';
        card.innerHTML = `
            <h3>${data}</h3>
            <p><strong>Profissional:</strong> ${agendamento.nomeAtendente}</p>
            <p><strong>Duração:</strong> ${agendamento.duracao}</p>
            <p><strong>Descrição:</strong> ${agendamento.descricao}</p>
            <p><strong>Pagamento:</strong> ${agendamento.pagamento}</p>
        `;
        container.appendChild(card);
    });
}


async function getAgendamentos() {
    const agendamentos = await fetch("/agendamentos-cliente");
    return agendamentos.json();
}

document.addEventListener("DOMContentLoaded", async () => {
    const agendamentos = await getAgendamentos();

    renderAgendamentos(agendamentos);
});