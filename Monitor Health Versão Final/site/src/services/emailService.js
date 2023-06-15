const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'monitorhealthatendimento@gmail.com',
        pass: 'paytnaujrcevietq'
    }
});

function sendMail(form, res){
    transport.sendMail({
        from: `${form.from}`,
        to: 'monitorhealthatendimento@gmail.com',
        subject: `Quero um orçamento!`,
        html: `
            <h1>Empresa: ${form.entrepriseName}</h1>
            <p>Responsável: ${form.responsableName}</p>
            <p>Telefone: ${form.phone}</p>
            <p>De: ${form.from}</p>
        `
    })
    .then(() => res.send("Email sent"))
    .catch((err) => console.log(err))
    sendMail2(form, res);
}

function sendMail2(form, res){
transport.sendMail({
    from: `${form.from}monitorhealthatendimento@gmail.com`,
    to: `${form.from}`,
    subject: `Monitor Health - Orçamento Recebido`,
    html: `
    <p>Olá ${form.responsableName}, Seu orçamento foi enviado com sucesso! Aguarde e logo mais um representante Monitor Health irá entrar em contato para mais informações.
    </p>
    <p>Abraços, Monitor Health</p>
    <div style="display: flex; align-items: center;">
    <img src="https://github.com/Monitor-Health/Vetores-Projeto2/blob/main/Contato.jpg?raw=true" width="800px">
    </div>
    `
})
.then(() => res.send("Email sent"))
.catch((err) => console.log(err))
}



module.exports = {
    sendMail
}