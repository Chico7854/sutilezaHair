const horarios = [
    "08:00",
    "08:30",
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
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
];

const carregarAgendamentos = async () => {
    try {
        const res = await fetch("/api/horarios");
        const agendamentos = await res.json();

        agendamentos.forEach((a) => {
            a.data = new Date(a.data);
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

// Popover

let popoverPinned = false;
let popoverAnchor = null;

const popover = (function createPopoverEl() {
    const p = document.createElement("div");
    p.id = "agendaPopover";
    p.setAttribute("role", "dialog");
    p.style.position = "absolute";
    p.style.minWidth = "220px";
    p.style.background = "#fff";
    p.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
    p.style.borderRadius = "8px";
    p.style.padding = "10px";
    p.style.zIndex = 9999;
    p.style.display = "none";
    p.style.fontSize = ".9rem";

    // conteúdo
    p.innerHTML = `
    <div id="popoverContent" style="margin-bottom:8px;"></div>
    <div style="display:flex;gap:8px;justify-content:flex-end;">
      <button id="popoverEditar" class="btn" style="padding:6px 8px;font-size:.85rem">Editar</button>
      <button id="popoverCancelar" class="btn-login-nav" style="padding:6px 8px;font-size:.85rem">Cancelar</button>
    </div>
  `;
    document.body.appendChild(p);

    // fechar ao clicar fora
    document.addEventListener("click", (ev) => {
        if (!p.contains(ev.target) && !ev.target.closest("td")) {
            if (!popoverPinned) closePopover(true);
        }
    });

    // Esc fecha se não estiver pinned
    document.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape" && !popoverPinned) closePopover(true);
    });

    return p;
})();

function openPopover(td, ev, pin = false) {
    if (!td) return;
    if (td.dataset.status !== "ocupado") return closePopover(true);
    popoverAnchor = td;
    popoverPinned = !!pin;

    // conteúdo
    const content = popover.querySelector("#popoverContent");
    const status = td.dataset.status || "livre";
    if (status === "ocupado") {
        content.innerHTML = `
      <div><strong>${td.dataset.servico || "Serviço"}</strong></div>
      <div style="opacity:.8">${td.dataset.profissional || ""}</div>
      <div style="font-size:.85rem;margin-top:6px;color:#444">${td.dataset.duracao} minutos</div>`;
    } else {
        content.innerHTML = `<div><strong>Horário livre</strong></div>`;
    }

    // posicionamento simples: abaixo do td (ajusta se ultrapassar a viewport)
    popover.style.display = "block";
    popover.style.opacity = "1";
    const rect = td.getBoundingClientRect();
    const docEl = document.documentElement;
    const top = rect.bottom + window.scrollY + 6;
    let left = rect.left + window.scrollX;

    // evita overflow direito
    const maxLeft =
        window.scrollX + docEl.clientWidth - popover.offsetWidth - 12;
    if (left > maxLeft) left = maxLeft;
    // evita overflow esquerdo
    if (left < 8) left = 8;

    popover.style.top = top + "px";
    popover.style.left = left + "px";

    // atualiza botões
    const btnEditar = document.getElementById("popoverEditar");
    const btnCancelar = document.getElementById("popoverCancelar");

    // attach handlers (remoção segura antes)
    if (btnEditar) {
        btnEditar.onclick = () => {
            if (!popoverAnchor) return;
            // simulação — substituir pela sua lógica de edição
            alert(
                `Editar (simulação) — ${popoverAnchor.dataset.servico || ""}`
            );
            // não fecha automaticamente; depende da sua UX
        };
    }

    if (btnCancelar) {
        btnCancelar.onclick = () => {
            if (!popoverAnchor) return;
        };
    }
}

function closePopover(forceClose) {
    if (!forceClose && popoverPinned) return;
    popover.style.display = "none";
    popoverPinned = false;
    popoverAnchor = null;
}

// Interações com a tabela: clique / foco

if (agendaBody) {
    agendaBody.addEventListener("click", (e) => {
        const td = e.target.closest("td");
        if (!td || td.classList.contains("time-col")) return;

        // Toggle pin: se já aberto e ancorado no mesmo td => fecha
        if (popoverPinned && popoverAnchor === td) {
            closePopover(true);
        } else {
            openPopover(td, e, true); // clique fixa (pinned)
        }
    });

    agendaBody.addEventListener("focusin", (e) => {
        const td = e.target.closest("td");
        if (!td || td.classList.contains("time-col")) return;
        openPopover(td, e, false); // foco apenas mostra (não pin)
    });

    agendaBody.addEventListener("focusout", (e) => {
        if (popoverPinned) return;
        // timeout para lidar com foco em botões do popover
        setTimeout(() => {
            if (!agendaBody.contains(document.activeElement)) {
                closePopover(true);
            }
        }, 120);
    });
}

// Exportação simples (CSV)

const btnExportar = document.getElementById("btnExportar");
if (btnExportar) {
    btnExportar.addEventListener("click", () => {
        const linhas = ["Dia,Hora,Status,Cliente,Profissional,Serviço,Duração"];
        agendamentos.forEach((a) => {
            linhas.push(
                `${a.dia},${a.hora},${a.status},${a.cliente},${a.profissional},${a.servico},${a.duracao}`
            );
        });
        const blob = new Blob([linhas.join("\n")], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "agenda_sutileza.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
}

// Popup Novo Horário

const popupNovoHorario = document.getElementById("popupNovoHorario");
const popupNovoHorarioFechar = document.getElementById(
    "popupNovoHorarioFechar"
);
const btnNovoHorario = document.getElementById("btnNovoHorario");
const popupNovoHorarioSalvar = document.getElementById(
    "popupNovoHorarioSalvar"
); // pode ser undefined no markup atual

if (btnNovoHorario && popupNovoHorario) {
    btnNovoHorario.addEventListener("click", (ev) => {
        ev.preventDefault();
        // mostra o popup (usa classe 'open' se disponível, senão style)
        if (popupNovoHorario.classList) popupNovoHorario.classList.add("open");
        popupNovoHorario.style.display = "flex";
        popupNovoHorario.setAttribute("aria-hidden", "false");

        // foco no primeiro input (se existir)
        const firstInput = popupNovoHorario.querySelector(
            "input,select,textarea,button"
        );
        if (firstInput) firstInput.focus();
    });
}

if (popupNovoHorarioFechar && popupNovoHorario) {
    popupNovoHorarioFechar.addEventListener("click", (ev) => {
        ev.preventDefault();
        if (popupNovoHorario.classList)
            popupNovoHorario.classList.remove("open");
        popupNovoHorario.style.display = "none";
        popupNovoHorario.setAttribute("aria-hidden", "true");
        if (btnNovoHorario) btnNovoHorario.focus();
    });
}

// fecha clicando no overlay (fora da caixa)
if (popupNovoHorario) {
    popupNovoHorario.addEventListener("click", (ev) => {
        if (ev.target === popupNovoHorario) {
            if (popupNovoHorario.classList)
                popupNovoHorario.classList.remove("open");
            popupNovoHorario.style.display = "none";
            popupNovoHorario.setAttribute("aria-hidden", "true");
            if (btnNovoHorario) btnNovoHorario.focus();
        }
    });

    // fecha com Esc
    document.addEventListener("keydown", (ev) => {
        if (ev.key === "Escape" && popupNovoHorario.style.display === "flex") {
            if (popupNovoHorario.classList)
                popupNovoHorario.classList.remove("open");
            popupNovoHorario.style.display = "none";
            popupNovoHorario.setAttribute("aria-hidden", "true");
            if (btnNovoHorario) btnNovoHorario.focus();
        }
    });
}

// Salvar - comportamento simulado (se houver botão com id popupNovoHorarioSalvar)
if (popupNovoHorarioSalvar && popupNovoHorario) {
    popupNovoHorarioSalvar.addEventListener("click", (ev) => {
        ev.preventDefault();
        const data =
            popupNovoHorario.querySelector("#novo_horario_data")?.value || "";
        const hora =
            popupNovoHorario.querySelector("#novo_horario_hora")?.value || "";
        const cliente =
            popupNovoHorario.querySelector("#novo_horario_cliente")?.value ||
            "";

        // fecha
        if (popupNovoHorario.classList)
            popupNovoHorario.classList.remove("open");
        popupNovoHorario.style.display = "none";
        popupNovoHorario.setAttribute("aria-hidden", "true");
    });
}