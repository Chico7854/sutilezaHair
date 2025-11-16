// Toggle senha
document.querySelectorAll(".pw-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-target");
        const input = document.getElementById(targetId);
        if (input.type === "password") {
            input.type = "text";
            btn.innerHTML = '<i class="fa-regular fa-eye-slash"></i>';
        } else {
            input.type = "password";
            btn.innerHTML = '<i class="fa-regular fa-eye"></i>';
        }
    });
});

const form = document.getElementById("formCadastro");
const feedback = document.getElementById("feedback");
const senha = document.getElementById("senha");
const confirmar = document.getElementById("confirmar");

function showFeedback(msg, ok = false) {
    feedback.style.display = "block";
    feedback.textContent = msg;
    feedback.className = "feedback " + (ok ? "success" : "error");
}

function clearFeedback() {
    feedback.style.display = "none";
    feedback.textContent = "";
    feedback.className = "feedback";
}

confirmar.addEventListener("input", () => {
    if (confirmar.value && confirmar.value !== senha.value) {
        confirmar.style.borderColor = "#c0392b";
    } else {
        confirmar.style.borderColor = "#d9c8aa";
    }
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearFeedback();

    if (senha.value !== confirmar.value) {
        showFeedback("As senhas não coincidem.");
        return;
    }
    if (!form.checkValidity()) {
        showFeedback("Preencha os campos obrigatórios corretamente.");
        return;
    }

    // Simulação
    showFeedback("Cadastro realizado com sucesso! Redirecionando...", true);
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1800);
});
