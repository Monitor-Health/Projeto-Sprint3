var options = {
    type: 'doughnut',
    data: {
        labels: ["Aberto (%)", "Fechado(%)" ],
        datasets: [{
            label: 'Status Geladeira',
            data: [15, 85],
            backgroundColor: ['#E8B1B1', '#A8C6A8']

        }]
    },
    options: {
        cutout: 70,
        ticks: {
            callback: function (value, index, values) {
                return `${value} % `
            }
        }
    }
}



const labels3 = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
];
const data3 = {
    labels: labels3,
    datasets: [{
        label: 'Temperatura °C',
        backgroundColor: 'rgb(77,77,77)',
        borderColor: 'rgb(77,77,77)',
        data: [5.5, 2.4, 3.1, 5.3, 4.2, 6.7, 7.15, 5.2, 4, 6.2, 5.9, 7.1],
        yAxisID: 'Temperatura',
        type: 'line',
        tension: 0.4
    },
    {
        label: 'Abertura',
        backgroundColor: 'rgb(224,224,224)',
        borderColor: 'rgb(224,224,224)',
        data: [501, 312, 405, 658, 512, 712, 698, 523, 456, 560, 815, 1015],
        yAxisID: 'Y',
        type: 'bar'
    }
    ]

}

const config3 = {
    data: data3,
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



var ctx = document.getElementById('Status_Geladeira').getContext('2d');
var chart = new Chart(ctx, options);


const tempXaberturaAnual = new Chart(
    document.getElementById('tempXaberturaAnual'),
    config3
)

