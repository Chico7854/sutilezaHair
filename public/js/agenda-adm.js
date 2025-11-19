const carregarHorarios = async () => {
    try {
        const res = await fetch("/api/horarios");
        const horarios = await res.json();

        return console.log(horarios);

    } catch (err) {
        console.log(err);
    }
}

carregarHorarios();

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
];

// Dias índice: 1=Segunda . 6=Sábado
// status: livre | ocupado | bloqueado
const agendamentos = [
    {
        dia: 1,
        hora: "08:30",
        cliente: "Marina Silva",
        profissional: "Paula",
        servico: "Corte Feminino",
        duracao: "45m",
        status: "ocupado",
    },
    {
        dia: 1,
        hora: "10:00",
        cliente: "Carlos Oliveira",
        profissional: "Rafa",
        servico: "Coloração",
        duracao: "1h30",
        status: "ocupado",
    },
    {
        dia: 1,
        hora: "14:00",
        cliente: "--",
        profissional: "Equipe",
        servico: "Intervalo",
        duracao: "30m",
        status: "bloqueado",
    },
    {
        dia: 2,
        hora: "09:00",
        cliente: "Ana Mendes",
        profissional: "Paula",
        servico: "Hidratação",
        duracao: "1h",
        status: "ocupado",
    },
    {
        dia: 2,
        hora: "15:30",
        cliente: "João Souza",
        profissional: "Rafa",
        servico: "Corte Masculino",
        duracao: "30m",
        status: "ocupado",
    },
    {
        dia: 3,
        hora: "11:00",
        cliente: "Beatriz Lima",
        profissional: "Carla",
        servico: "Luzes",
        duracao: "2h",
        status: "ocupado",
    },
    {
        dia: 3,
        hora: "16:30",
        cliente: "--",
        profissional: "Equipe",
        servico: "Reunião",
        duracao: "30m",
        status: "bloqueado",
    },
    {
        dia: 4,
        hora: "08:00",
        cliente: "Patrícia Reis",
        profissional: "Carla",
        servico: "Escova",
        duracao: "45m",
        status: "ocupado",
    },
    {
        dia: 4,
        hora: "13:30",
        cliente: "Renato Gomes",
        profissional: "Rafa",
        servico: "Barba + Corte",
        duracao: "1h",
        status: "ocupado",
    },
    {
        dia: 5,
        hora: "10:30",
        cliente: "Luciana Prado",
        profissional: "Paula",
        servico: "Botox Capilar",
        duracao: "2h",
        status: "ocupado",
    },
    {
        dia: 5,
        hora: "17:00",
        cliente: "--",
        profissional: "Equipe",
        servico: "Manutenção",
        duracao: "1h",
        status: "bloqueado",
    },
    {
        dia: 6,
        hora: "09:30",
        cliente: "Sofia Martins",
        profissional: "Carla",
        servico: "Penteado",
        duracao: "1h15",
        status: "ocupado",
    },
    {
        dia: 6,
        hora: "11:30",
        cliente: "Marcos Vinicius",
        profissional: "Rafa",
        servico: "Corte Masculino",
        duracao: "30m",
        status: "ocupado",
    },
    {
        dia: 6,
        hora: "15:00",
        cliente: "Fernanda Rocha",
        profissional: "Paula",
        servico: "Tratamento Nutrição",
        duracao: "1h",
        status: "ocupado",
    },
];

/*******************
 * Popula filtros (profissionais / serviços)
 *******************/
const profissionais = [
    ...new Set(
        agendamentos
            .filter(
                (a) =>
                    a.profissional &&
                    a.profissional !== "Equipe" &&
                    a.cliente !== "--"
            )
            .map((a) => a.profissional)
    ),
].sort();

const servicos = [
    ...new Set(
        agendamentos
            .filter(
                (a) =>
                    a.servico &&
                    !/Intervalo|Reunião|Manutenção/i.test(a.servico)
            )
            .map((a) => a.servico)
    ),
].sort();

const filtroProfissional = document.getElementById("filtroProfissional");
const filtroServico = document.getElementById("filtroServico");

if (filtroProfissional && filtroServico) {
    profissionais.forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        filtroProfissional.appendChild(opt);
    });

    servicos.forEach((s) => {
        const opt = document.createElement("option");
        opt.value = s;
        opt.textContent = s;
        filtroServico.appendChild(opt);
    });
}

/*******************
 * Renderização da tabela
 *******************/
const agendaBody = document.getElementById("agendaBody");

function getAgendamento(dia, hora) {
    return agendamentos.find((a) => a.dia === dia && a.hora === hora);
}

function passaFiltro(ag) {
    if (!ag) return true;
    if (
        filtroProfissional &&
        filtroProfissional.value &&
        ag.profissional !== filtroProfissional.value
    )
        return false;
    if (
        filtroServico &&
        filtroServico.value &&
        ag.servico !== filtroServico.value
    )
        return false;
    return true;
}

function renderTabela() {
    if (!agendaBody) return;
    agendaBody.innerHTML = "";
    horarios.forEach((hora) => {
        const tr = document.createElement("tr");

        // Coluna horário
        const timeTd = document.createElement("td");
        timeTd.textContent = hora;
        timeTd.className = "time-col";
        timeTd.setAttribute("aria-label", `Horário ${hora}`);
        tr.appendChild(timeTd);

        for (let dia = 1; dia <= 6; dia++) {
            const ag = getAgendamento(dia, hora);
            const td = document.createElement("td");
            td.tabIndex = 0; // acessível
            td.dataset.hora = hora;
            td.dataset.dia = dia;

            if (ag) {
                td.dataset.cliente = ag.cliente;
                td.dataset.profissional = ag.profissional;
                td.dataset.servico = ag.servico;
                td.dataset.duracao = ag.duracao;
                td.dataset.status = ag.status;

                if (!passaFiltro(ag)) {
                    td.className = "slot-livre";
                    td.innerHTML = "<span style='opacity:.25'>Livre</span>";
                } else {
                    if (ag.status === "ocupado") {
                        td.classList.add("slot-ocupado");
                        td.innerHTML = `<div style="font-size:.65rem;line-height:1.15">
                    <strong>${ag.servico}</strong><br>
                    <span style="opacity:.75">${ag.profissional}</span>
                </div>`;
                    } else if (ag.status === "bloqueado") {
                        td.classList.add("slot-bloqueado");
                        td.innerHTML = `<span style="font-size:.6rem;opacity:.7">${ag.servico}</span>`;
                        td.setAttribute("aria-disabled", "true");
                    }
                }
            } else {
                td.className = "slot-livre";
                td.innerHTML =
                    "<span style='font-size:.65rem;opacity:.55'>Livre</span>";
                td.dataset.status = "livre";
            }

            tr.appendChild(td);
        }

        agendaBody.appendChild(tr);
    });
}

if (filtroProfissional)
    filtroProfissional.addEventListener("change", renderTabela);
if (filtroServico) filtroServico.addEventListener("change", renderTabela);

renderTabela();

/*******************
 * Popover (corrigido e robusto)
 *
 * - cria um popover simples dinamicamente
 * - openPopover(td, event, pin) e closePopover(pinClose)
 * - mantém estado: popoverPinned, popoverAnchor
 *******************/
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
      <button id="popoverMover" class="btn" style="padding:6px 8px;font-size:.85rem">Mover</button>
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
    popoverAnchor = td;
    popoverPinned = !!pin;

    // conteúdo
    const content = popover.querySelector("#popoverContent");
    const status = td.dataset.status || "livre";
    if (status === "ocupado") {
        content.innerHTML = `
      <div><strong>${td.dataset.servico || "Serviço"}</strong></div>
      <div style="opacity:.8">${td.dataset.profissional || ""} • ${
            td.dataset.duracao || ""
        }</div>
      <div style="font-size:.85rem;margin-top:6px;color:#444">${
          td.dataset.cliente || ""
      }</div>
    `;
    } else if (status === "bloqueado") {
        content.innerHTML = `<div><strong>${
            td.dataset.servico || "Bloqueado"
        }</strong></div>`;
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
    const btnMover = document.getElementById("popoverMover");
    const btnCancelar = document.getElementById("popoverCancelar");

    // habilita/desabilita botões conforme status
    if (btnEditar)
        btnEditar.disabled = status === "livre" || status === "bloqueado";
    if (btnMover) btnMover.disabled = status !== "ocupado";
    if (btnCancelar) btnCancelar.disabled = status !== "ocupado";

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

    if (btnMover) {
        btnMover.onclick = () => {
            if (!popoverAnchor) return;
            // simulação — lógica para mover agendamento
            alert(`Mover (simulação) — ${popoverAnchor.dataset.servico || ""}`);
            closePopover(true);
        };
    }

    if (btnCancelar) {
        btnCancelar.onclick = () => {
            if (!popoverAnchor) return;
            const statusLocal = popoverAnchor.dataset.status;
            if (statusLocal !== "ocupado") {
                alert("Nada para cancelar.");
                return;
            }
            if (confirm("Cancelar este agendamento?")) {
                // transforma visualmente em livre (simulação)
                popoverAnchor.className = "slot-livre";
                popoverAnchor.innerHTML =
                    "<span style='font-size:.65rem;opacity:.55'>Livre</span>";
                popoverAnchor.dataset.status = "livre";
                delete popoverAnchor.dataset.cliente;
                delete popoverAnchor.dataset.servico;
                delete popoverAnchor.dataset.profissional;
                delete popoverAnchor.dataset.duracao;
                closePopover(true);
                alert("Agendamento cancelado (simulação).");
            }
        };
    }
}

function closePopover(forceClose) {
    if (!forceClose && popoverPinned) return;
    popover.style.display = "none";
    popoverPinned = false;
    popoverAnchor = null;
}

/*******************
 * Interações com a tabela: clique / foco
 *******************/
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

/*******************
 * Exportação simples (CSV)
 *******************/
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

/*******************
 * Popup Novo Horário (robusto)
 * - usa o popup já presente no EJS, mas protege casos onde IDs não existem
 *******************/
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
