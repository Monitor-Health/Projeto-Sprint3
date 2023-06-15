CREATE DATABASE MonitorHealth;
USE MonitorHealth;

CREATE TABLE Segmento(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(200)
);

CREATE TABLE Estado(
    id INT PRIMARY KEY AUTO_INCREMENT,
    sigla CHAR(2) NOT NULL
);

CREATE TABLE Empresa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nomeResposavel VARCHAR (60) NOT NULL,
  nomeFantasia VARCHAR (60) NOT NULL,
  cnpj CHAR (14) NOT NULL,
  tel CHAR (14) NOT NULL,
  cep CHAR(10),
  tipoLogradouro VARCHAR(100),
  logradouro VARCHAR (200) NOT NULL,
  numero VARCHAR (5) NOT NULL,
  complemento VARCHAR (20),
  bairro VARCHAR (200),
  cidade VARCHAR (200) NOT NULL,
  fkEstado INT,
  CONSTRAINT fkEstadoConst FOREIGN KEY (fkEstado) REFERENCES Estado(id)
  );

CREATE TABLE Permissao(
    id INT PRIMARY KEY AUTO_INCREMENT,
    autoridade VARCHAR(100)
);

CREATE TABLE Usuario (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR (60) NOT NULL,
  senha VARCHAR (60) NOT NULL,
  fkPermissao INT,
  fkEmpresa INT,
  CONSTRAINT fkPermissaoConst FOREIGN KEY (fkPermissao) REFERENCES Permissao(id),
  CONSTRAINT fkEmpresaConst FOREIGN KEY (fkEmpresa) REFERENCES Empresa(id)
);

CREATE TABLE TipoSensor(
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(100)
);

CREATE TABLE Sensor (
  id INT ,
  dtInstalacao DATE NOT NULL,
  tipo INT,
  ambiente VARCHAR (100) NOT NULL,
  fkEmpresa INT,
  CONSTRAINT fkEmpresaConstSensor FOREIGN KEY (fkEmpresa) REFERENCES Empresa(id),
  primary key (id, tipo)
);

CREATE TABLE empresaSegmento(
empresa_id INT,
segmento_id INT,
dtHr DATETIME,
constraint constEmpresa_id foreign key (empresa_id) references Empresa(id),
constraint constSegmento_id foreign key (segmento_id) references Segmento(id),
constraint pkAssociativa primary key (empresa_id,segmento_id)
);

CREATE TABLE Dados (
  id INT auto_increment primary key,
  valor FLOAT NOT NULL,
  dt_hora DATETIME NOT NULL,
  fkidSensor INT,
  fktipoSensor INT,
  CONSTRAINT fkSensorConstTemp FOREIGN KEY (fkidSensor, fktipoSensor) REFERENCES Sensor(id, tipo)
);


INSERT INTO Estado (sigla) VALUES
('AC'),
('AL'),
('AP'),
('AM'),
('BA'),
('CE'),
('DF'),
('ES'),
('GO'),
('MA'),
('MT'),
('MS'),
('MG'),
('PA'),
('PB'),
('PR'),
('PE'),
('PI'),
('RJ'),
('RN'),
('RS'),
('RO'),
('RR'),
('SC'),
('SP'),
('SE'),
('TO');

INSERT INTO Segmento (nome) VALUES
('Farmacêutico'),
('Seguros de saúde'),
('Tecnologia da Informação em Saúde');

INSERT INTO Empresa (nomeResposavel, nomeFantasia, cnpj, tel, cep, tipoLogradouro, logradouro, numero, complemento, bairro, cidade, fkEstado) VALUES 
('João Silva', 'Vacina Fácil', '12345678901234', '(11)99999-9999', '00000-000', 'Rua', 'Rua das Flores', '123', 'Sala 2', 'Centro', 'São Paulo', 25),
('Maria Santos', 'Imunização Segura', '23456789012345', '(21)88888-8888', '11111-111', 'Avenida', 'Avenida dos Coqueiros', '456', NULL, 'Praia do Futuro', 'Fortaleza', 6),
('José Pereira', 'Vacine Já', '34567890123456', '(51)77777-7777', '22222-222', 'Rua', 'Rua das Palmeiras', '789', NULL, 'Jardim Botânico', 'Porto Alegre', 20);

INSERT INTO empresaSegmento VALUES
(1,1,now()),
(1,2,now()),
(2,1,now()),
(2,2,now());

INSERT INTO Permissao (autoridade) VALUES 
('Administrador'),
('Usuário comum');

INSERT INTO Usuario (email, senha, fkPermissao, fkEmpresa) VALUES
('joao.silva@vacinafacil.com', 'senhajoao', 1, 1),
('maria.santos@imunizacaosegura.com', 'senhamaria', 2, 2),
('jose.pereira@vacineja.com', 'senhajose', 2, 3);


INSERT INTO TipoSensor VALUES
(NULL, 'Presença'),
(NULL, 'Temperatura');

INSERT INTO Sensor VALUES
(1, '2022-01-01', 1, 'Freezer 01', 1),
(2, '2022-01-01', 1, 'Freezer 02', 1),
(3, '2022-02-01', 1, 'Freezer 03', 1),
(4, '2022-02-01', 1, 'Freezer 04', 1),
(5, '2022-03-01', 1, 'Freezer 05', 1),
(1, '2022-01-01', 2, 'Freezer 01', 1),
(2, '2022-01-01', 2, 'Freezer 02', 1),
(3, '2022-02-01', 2, 'Freezer 03', 1),
(4, '2022-02-01', 2, 'Freezer 04', 1),
(5, '2022-03-01', 2, 'Freezer 05', 1);
desc sensor;
insert into dados values
(null, 2, '2023-05-26 14:18:00',1,2),
(null, 3, '2023-05-26 14:19:00',1,2),
(null, 4, '2023-05-26 14:20:00',1,2),
(null, 2, '2023-05-26 14:21:00',1,2),
(null, 1, '2023-05-26 14:22:00',1,2),
(null, 5, '2023-05-26 14:23:00',1,2),
(null, 6, '2023-05-26 14:24:00',2,2),
(null, 3, '2023-05-26 14:25:00',2,2),
(null, 4, '2023-05-26 14:26:00',2,2),
(null, 2, '2023-05-26 14:27:00',2,2),
(null, 4, '2023-05-26 14:28:00',2,2),
(null, 2, '2023-05-26 14:29:00',2,2),
(null, 0, '2023-05-26 14:18:00',1,1),
(null, 0, '2023-05-26 14:19:00',1,1),
(null, 1, '2023-05-26 14:20:00',1,1),
(null, 1, '2023-05-26 14:21:00',1,1),
(null, 1, '2023-05-26 14:22:00',1,1),
(null, 0, '2023-05-26 14:23:00',1,1),
(null, 1, '2023-05-26 14:24:00',2,1),
(null, 0, '2023-05-26 14:25:00',2,1),
(null, 0, '2023-05-26 14:26:00',2,1),
(null, 1, '2023-05-26 14:27:00',2,1),
(null, 1, '2023-05-26 14:28:00',2,1),
(null, 0, '2023-05-26 14:29:00',2,1);

INSERT INTO dados VALUES 
(null, 2, '2023-05-26 14:18:00',1,2),
(null, 3, '2023-05-26 14:19:00',1,2),
(null, 4, '2023-05-26 14:20:00',1,2),
(null, 2, '2023-05-26 14:21:00',1,2),
(null, 1, '2023-05-26 14:22:00',1,2),
(null, 5, '2023-05-26 14:23:00',1,2),
(null, 6, '2023-05-26 14:24:00',2,2),
(null, 3, '2023-05-26 14:25:00',2,2),
(null, 4, '2023-05-26 14:26:00',2,2),
(null, 2, '2023-05-26 14:27:00',2,2),
(null, 4, '2023-05-26 14:28:00',2,2),
(null, 2, '2023-05-26 14:29:00',2,2),
(null, 0, '2023-05-26 14:18:00',1,1),
(null, 0, '2023-05-26 14:19:00',1,1),
(null, 1, '2023-05-26 14:20:00',1,1),
(null, 1, '2023-05-26 14:21:00',1,1),
(null, 1, '2023-05-26 14:22:00',1,1),
(null, 0, '2023-05-26 14:23:00',1,1),
(null, 1, '2023-05-26 14:24:00',2,1),
(null, 0, '2023-05-26 14:25:00',2,1),
(null, 0, '2023-05-26 14:26:00',2,1),
(null, 1, '2023-05-26 14:27:00',2,1),
(null, 1, '2023-05-26 14:28:00',2,1),
(null, 0, '2023-05-26 14:29:00',2,1);


SELECT * FROM Segmento;
SELECT * FROM Estado;
SELECT * FROM Empresa;
SELECT * FROM Permissao;
SELECT * FROM Usuario;
SELECT * FROM TipoSensor;
SELECT * FROM Sensor;
select * from Dados;