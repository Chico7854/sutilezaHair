const horarios = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
];

const dataSelecionada = document.getElementById("dataSelecionada");
const hoje = new Date();
const ano = hoje.getFullYear();
const mes = hoje.getMonth() + 1;
const dia = hoje.getDate();
dataSelecionada.value = `${ano}-${mes}-${dia}`;

//TODO: calculo do horario inicio e final esta errado, 10h00 era pra ser 1000 mas esta apenas 10
const carregarAgendamentos = async () => {
    try {
        const res = await fetch("/adm/horarios", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: dataSelecionada.value })
        });
        const agendamentos = await res.json();

        agendamentos.forEach((a) => {
            a.data = new Date(a.data);
            
            const ano = a.data.getFullYear();
            const mes = String((a.data.getMonth() + 1)).padStart(2, "0");
            const dia = String(a.data.getDate()).padStart(2, "0");

            a.diaISO = `${ano}-${mes}-${dia}`;

            a.horarioInicioISO = a.data.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            });
            a.dia = a.data.getDay();

            let horaInicio = a.data.getHours();
            let minutosInicio = a.data.getMinutes();
            let horaFinal = horaInicio + ((a.duracao + minutosInicio) / 60);
            let minutosFinal = (a.duracao + minutosInicio) % 60;

            a.horarioInicio = parseInt(`${horaInicio} + ${minutosInicio}`);
            a.horarioFinal = parseInt(`${horaFinal} + ${minutosFinal}`);
        });

        return agendamentos;

    } catch (err) {
        console.log(err);
    }
}

// Renderização da tabela
const agendaBody = document.getElementById("agendaBody");

function getAgendamento(dia, hora, agendamentos) {
    hora = parseInt(hora.replace(";", ""));
    return agendamentos.find((a) => (a.dia === dia) && (a.horarioInicio <= hora && a.horarioFinal >= hora));
}

async function renderTabela() {
    if (!agendaBody) return;
    const agendamentos = await carregarAgendamentos();

    agendaBody.innerHTML = "";
    horarios.forEach((hora) => {
        const tr = document.createElement("tr");

        // Coluna horário
        const timeTd = document.createElement("td");
        timeTd.textContent = hora;
        timeTd.className = "time-col";
        timeTd.setAttribute("aria-label", `Horário ${hora}`);
        tr.appendChild(timeTd);

        for (let dia = 0; dia <= 6; dia++) {
            const ag = getAgendamento(dia, hora, agendamentos);
            const td = document.createElement("td");
            td.tabIndex = 0; // acessível
            td.dataset.hora = hora;
            td.dataset.dia = dia;

            if (ag) {
                td.dataset.id = ag._id;
                td.dataset.diaISO = ag.diaISO;
                td.dataset.horarioInicio = ag.horarioInicioISO;
                td.dataset.cliente = ag.nomeCliente;
                td.dataset.profissional = ag.nomeAtendente;
                td.dataset.servico = ag.descricao;
                td.dataset.duracao = ag.duracao;
                td.dataset.pagamento = ag.pagamento;
                td.dataset.status = "ocupado"

                td.classList.add("slot-ocupado");
                td.innerHTML = `<div style="font-size:.65rem;line-height:1.15">
                                    <strong>${ag.nomeCliente}</strong><br>
                                </div>`;
            } else {
                td.className = "slot-livre";
                td.innerHTML = "<span style='font-size:.65rem;opacity:.55'>Livre</span>";
                td.dataset.status = "livre";
            }

            tr.appendChild(td);
        }

        agendaBody.appendChild(tr);
    });
}

renderTabela();

dataSelecionada.addEventListener("change", renderTabela);