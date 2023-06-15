document.getElementById("profile-name").value = `Olá, ${sessionStorage.getItem("EMAIL_USUARIO")}`
document.getElementById("permission").value = `${() => {

    if (sessionStorage.getItem("PERMISSAO") == 1) {
        return "administrador"
    } else {
        return "básico"
    }

}
    }`

const data = new Date()
const dia = String(data.getDate()).padStart(2, '0')
const mes = String(data.getMonth() + 1).padStart(2, '0')
const ano = data.getFullYear()
const hora = String(data.getHours()).padStart(2, '0')
const minutos = String(data.getMinutes()).padStart(2, '0')
const segundos = String(data.getSeconds()).padStart(2, '0')
dataAtual.innerHTML = `${dia}/${mes}/${ano} - ${hora}:${minutos}:${segundos}`

var freezer = 1;
var firstChart = document.getElementById('first_chart');
var secondChart = document.getElementById('second_chart');

async function updateDash(firstChart, secondChart) {
    freezer = Number(input_freezer.value)
    var temperaturas = [];
    var isPresent = [];
    const resposta = await fetch(`/medidas/ultimas/${freezer}`);
    const aberturas = await (await fetch(`/medidas/aberturas/${freezer}`)).json();
    const dados = await resposta.json();

    var soma = 0;
    var temperaturas = [];
    for (var i = 0; i < dados.length; i++) {
        var dado = dados[i]
        if (dado.fktipoSensor == 2) {
            soma += dado.valor;
            temperaturas.push(dado.valor);
        }
    }

    var hora = aberturas[0].aberturas / 20;
    var minuto = (hora - parseInt(hora)) * 60;
    var hora_texto = parseInt(hora);
    var minuto_texto = parseInt(minuto);
    if(hora_texto <= 9){
        hora_texto = "0" + hora_texto;
    }
    if(minuto_texto <= 9){
        minuto_texto = "0" + minuto_texto;
    }
    measurement.innerHTML = `${hora_texto}:${minuto_texto}`;

    var times = []
    for (let i = dados.length; i > 0; i--) {
        var value = dados[i - 1];
        if (value.fktipoSensor == 2) {
            times.push(parseDate(new Date(value.dt_hora)));
        }
    }

    var temperaturas = [];
    for (let i = dados.length; i > 0; i--) {
        var value = dados[i - 1];
        if (value.fktipoSensor == 2) {
            temperaturas.push(value.valor);
        }
    }
    var isPresent = [];
    for (let i = 0; i < dados.length; i++) {
        var value = dados[i];
        if (value.fktipoSensor == 1) {
            if (value.valor == 1) {
                isPresent.push(value.valor);
            }
        }
    }
    firstChart.config.data.labels.shift();
    firstChart.data.datasets[0].data.shift();
    
    secondChart.config.data.labels.shift();
    secondChart.data.datasets[0].data.shift();
    
    firstChart.data.datasets[0].data = temperaturas;
    firstChart.config.data.labels = times;
    secondChart.data.datasets[0].data = temperaturas;
    secondChart.data.datasets[1].data = isPresent;
    secondChart.config.data.labels = times;
    firstChart.update();
    secondChart.update();
    var media = soma / dados.length;
    var tempAtual = temperaturas[temperaturas.length - 1];
    indicators(media, tempAtual)
    setTimeout(() => updateDash(firstChart, secondChart), 1000)
}

function indicators(media, tempAtual){
    if (media > 8) {
        indicator_avg_temp.classList = "indicator";
        indicator_avg_temp.classList.add("danger");
    } else if (media >= 6.27 && media <= 8) {
        indicator_avg_temp.classList = "indicator";
        indicator_avg_temp.classList.add("emergency");
    } else if (media >= 5.09 && media <= 6.26) {
        indicator_avg_temp.classList = "indicator";
        indicator_avg_temp.classList.add("warning");
    } else if (media >= 3.38 && media <= 5.08) {
        indicator_avg_temp.classList = "indicator";
        indicator_avg_temp.classList.add("success");
    } else if (media >= 2 && media <= 3.37) {
        indicator_avg_temp.classList = "indicator";
        indicator_avg_temp.classList.add("light-blue");
    } else {
        indicator_avg_temp.classList = "indicator";
        indicator_avg_temp.classList.add("freezing");
    }

    if (tempAtual > 8) {
        indicator_current_temp.classList = "indicator";
        indicator_current_temp.classList.add("danger");
    } else if (tempAtual >= 6.27 && tempAtual <= 8) {
        indicator_current_temp.classList = "indicator";
        indicator_current_temp.classList.add("emergency");
    } else if (tempAtual >= 5.09 && tempAtual <= 6.26) {
        indicator_current_temp.classList = "indicator";
        indicator_current_temp.classList.add("warning");
    } else if (tempAtual >= 3.38 && tempAtual <= 5.08) {
        indicator_current_temp.classList = "indicator";
        indicator_current_temp.classList.add("success");
    } else if (tempAtual >= 2 && tempAtual <= 3.37) {
        indicator_current_temp.classList = "indicator";
        indicator_current_temp.classList.add("light-blue");
    } else {
        indicator_current_temp.classList = "indicator";
        indicator_current_temp.classList.add("freezing");
    }
    current_temp.innerHTML = tempAtual.toFixed(2);
    avg.innerHTML = media.toFixed(2);
}

window.addEventListener("DOMContentLoaded", async () => {
    if (sessionStorage.length == 0) {
        window.location = "../index.html";
    }
    const resposta = await fetch(`/medidas/ultimas/${freezer}`);
    const dados = await resposta.json();
    createFirstChart(dados);
    createSecondChart(dados);
    updateDash(firstChart, secondChart);
    showAlerts()
});

async function showAlerts() {
    const response = await fetch('/medidas/tempo-real');
    const data = await response.json();
    const temperaturasTodosFreezer = [];
    for(let i = 0; i < data.length; i++){
        temperaturasTodosFreezer.push({
            freezer: data[i].fkidSensor,
            valor: data[i].valor,
            tipo: data[i].fktipoSensor,
            data: parseDate(new Date(data[i].dt_hora))
        });
    }
    console.log(temperaturasTodosFreezer);
    for (var i = temperaturasTodosFreezer.length - 1; i > temperaturasTodosFreezer.length - 11; i--) {
        var ultimoFreezer = temperaturasTodosFreezer[i].freezer;
        var valor = temperaturasTodosFreezer[i].valor;
        var tipoSensor = temperaturasTodosFreezer[i].tipo;
        var tempo = temperaturasTodosFreezer[i].data.split(":");
        var hora = tempo[0];
        if (tipoSensor == 2) {
            if (valor > 8) {
                await Swal.fire({
                    title: `Freezer: ${ultimoFreezer}, Derretendo`,
                    timer: 3000,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    color: "white",
                    background: "#c55353"
                });
            } else if (valor >= 6.27 && valor <= 8) {
                await Swal.fire({
                    title: `Freezer: ${ultimoFreezer}, Emergência`,
                    timer: 3000,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    color: "white",
                    background: "#e7b1b1"
                });
            } else if (valor >= 5.09 && valor <= 6.26) {
                await Swal.fire({
                    title: `Freezer: ${ultimoFreezer}, Quente`,
                    timer: 3000,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    color: "black",
                    background: "#f9ec93"
                })
            } else if (valor >= 2 && valor <= 3.37) {
                await Swal.fire({
                    title: `Freezer: ${ultimoFreezer}, Frio`,
                    timer: 3000,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    color: "white",
                    background: "#9fb7c3"
                });
            } else if (valor < 2) {
                await Swal.fire({
                    title: `Freezer: ${ultimoFreezer}, Congelante`,
                    timer: 3000,
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    color: "white",
                    background: "#5384a2"
                })
            }
        }
        if (valor == 1 && tipoSensor == 1 && ultimoFreezer == 2 && (hora >= 14 && hora <= 16)) {
            await Swal.fire({
                title: `Freezer: ${ultimoFreezer}, ABERTO FORA DO HORÁRIO`,
                timer: 5000,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                color: "white",
                background: "black"
            })
        }
    }
    setTimeout(showAlerts(), 1000);
}


function createFirstChart(values) {

    var times = []
    for (let i = values.length; i > 0; i--) {
        var value = values[i - 1];
        if (value.tipo == 2) {
            times.push(parseDate(new Date(value.dt_hora)));
        }
    }

    var temperatures = [];
    for (let i = values.length; i > 0; i--) {
        var value = values[i - 1];
        if (value.fktipoSensor == 2) {
            temperatures.push(value.valor);
        }
    }

    const labels = times;
    const data = {
        labels: labels,
        datasets: [{
            label: 'Temperatura °C',
            backgroundColor: 'rgb(77,77,77)',
            borderColor: 'rgb(77,77,77)',
            data: temperatures
        }]
    }
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                y: {
                    suggestedMin: 0,
                    suggestedMax: 10
                },
                x: {
                    suggestedMax: 10
                }

            },
            plugins: {
                title: {
                    text: "Temperatura °C"


                },
                legend: {
                    labels: {
                        font: {
                            family: "Montserrat",
                            weight: "bold"
                        }
                    }
                }
            }
        }
    }

    var ctx = document.getElementById('first_chart');
    firstChart = new Chart(ctx, config)
}

function createSecondChart(values) {

    var times = []
    for (let i = values.length; i > 0; i--) {
        var value = values[i - 1];
        if (value.fktipoSensor == 2) {
            times.push(parseDate(new Date(value.dt_hora)));
        }
    }

    var temperatures = [];
    for (let i = values.length; i > 0; i--) {
        var value = values[i - 1];
        if (value.fktipoSensor == 2) {
            temperatures.push(value.valor);
        }
    }
    var isPresent = [];
    for (let i = values.length; i > 0; i--) {
        var value = values[i - 1];
        if (value.fktipoSensor == 1) {
            if (value.valor == 1) {
                isPresent.push(value.valor);
            }
        }
    }

    const labels2 = times;
    const data2 = {
        labels: labels2,
        datasets: [{
            label: 'Temperatura °C',
            backgroundColor: 'rgb(77,77,77)',
            borderColor: 'rgb(77,77,77)',
            data: temperatures,
            yAxisID: 'Temperatura',
            type: 'line',
            tension: 0.4
        },
        {
            label: 'Abertura',
            backgroundColor: 'rgb(224,224,224)',
            borderColor: 'rgb(224,224,224)',
            data: isPresent,
            yAxisID: 'Y',
            type: 'bar'
        }
        ]

    }
    const config2 = {
        data: data2,
        options: {
            responsive: true,
            scales: {
                Y: {
                    type: 'linear',
                    position: 'left'
                },
                Temperatura: {
                    beginAtZero: true,
                    suggestedMax: 10,
                    type: 'linear',
                    position: 'right',
                    grid: {
                        drawOnChartArea: false
                    },
                    ticks: {
                        callback: function (value, index, values) {
                            return `${value} °C `
                        }
                    }
                }
            },
            plugins: {
                title: {
                    text: "Temperatura °C"
                },
                legend: {
                    labels: {
                        font: {
                            family: "Montserrat",
                            weight: "bold"
                        }
                    }
                }
            }
        }
    }

    var ctx = document.getElementById('second_chart');
    secondChart = new Chart(ctx, config2)
}


function parseDate(data) {
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')
    const ano = data.getFullYear()
    const hora = String(data.getHours()).padStart(2, '0')
    const minutos = String(data.getMinutes()).padStart(2, '0')
    const segundos = String(data.getSeconds()).padStart(2, '0')
    dataAtual.innerHTML = `${dia}/${mes}/${ano} - ${hora}:${minutos}:${segundos}`
    return `${hora}:${minutos}:${segundos}`;
}