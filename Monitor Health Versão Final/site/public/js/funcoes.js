
function validarSessao() {
    var email = sessionStorage.EMAIL_USUARIO;
    var nome = sessionStorage.NOME_USUARIO;

    var b_usuario = document.getElementById("b_usuario");

    if (email != null && nome != null) {
        b_usuario.innerHTML = nome;
    } else {
        window.location = "../login.html";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../index.html";
}

function sendMail() {
    var email = input_email.value;
    var telefone = input_telefone.value;
    var empresa = input_empresa.value;
    var responsavel = input_responsavel.value;

    if (email == "" || telefone == "" ||empresa == "" ||responsavel == ""){
        div_alert.innerHTML = `
                    <div class="div_1"
                        style="margin-top: 25px; width: 350px;height: 150px;background-color: #ad1d20ff;border-radius: 30px;display: flex;align-items: center;justify-content: center;gap: 30px;">
                        <div>
                            <img src="./vetores/nao check.png" width="100px">
                        </div>
                        <div style="width: 40%; text-align: center; font-size: x-large; font-weight: 700;
                            color: white;">
                            Campos vazios!
                        </div>
                    </div>
                `;

                div_alert.style.display = "block";

                setTimeout(function () {
                    div_alert.style.display = "none";
                }, 2000);

                var inputs = document.querySelectorAll("input");
                inputs.forEach(function (input) {
                    input.value = "";
                });
    } else {
    var form = {
        from: email,
        entrepriseName: empresa,
        responsableName: responsavel,
        phone: telefone
    }
    fetch('/email/sendmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
    })
        .then(() => {
            div_alert.innerHTML = `
                    <div class="div_1"
                        style="margin-top: 25px; width: 350px;height: 150px;background-color: #57823e;border-radius: 30px;display: flex;align-items: center;justify-content: center;gap: 30px;">
                        <div>
                            <img src="./vetores/check.svg" width="100px">
                        </div>
                        <div style="width: 40%; text-align: center; font-size: x-large; font-weight: 700;
                            color: white;">
                            Email Enviado!
                        </div>
                    </div>
                `;

                div_alert.style.display = "block";

                setTimeout(function () {
                    div_alert.style.display = "none";
                }, 2000);

                var inputs = document.querySelectorAll("input");
                inputs.forEach(function (input) {
                    input.value = "";
                });
        })
        .catch(() => {
            div_alert.innerHTML = `
                    <div class="div_1"
                        style="margin-top: 25px; width: 350px;height: 150px;background-color: #ad1d20ff;border-radius: 30px;display: flex;align-items: center;justify-content: center;gap: 30px;">
                        <div>
                            <img src="./vetores/check.svg" width="100px">
                        </div>
                        <div style="width: 40%; text-align: center; font-size: x-large; font-weight: 700;
                            color: white;">
                            Erro ao enviar!
                        </div>
                    </div>
                `;

                div_alert.style.display = "block";

                setTimeout(function () {
                    div_alert.style.display = "none";
                }, 2000);

                var inputs = document.querySelectorAll("input");
                inputs.forEach(function (input) {
                    input.value = "";
                });
        });
}
}