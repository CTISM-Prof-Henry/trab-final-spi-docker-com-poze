[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/agg6sSBC)
# Docker com poze

Projeto desenvolvido para a cadeira de ES II.
Sistema de agendamento de salas pois nosso grandioso colégio politécnico não conseguiu
desenvolver isso ainda.

## Sumário

* [Pré-requisitos](#pré-requisitos)
* [Instalação](#instalação)
* [Instruções de uso](#instruções-de-uso)
* [Contato](#contato)

## Pré-requisitos

Acredito que isso aqui seja bullshitagem, tem como rodar em qualquer torradeira, talvez oq mais pese seja o docker
mas ai, da pra dar um jeito de abrir a docker engine só pelo temrinal se pesquisar um pouco...

| Configuração        | Valor                    |
|---------------------|--------------------------|
| Sistema operacional | Qualquer um              |
| Processador         | Qualquer um tbm          |
| Memória RAM         | 4 ta bom                 |
| Necessita rede?     | Não                      |

Apps necessários:
 * Docker
 * Node (22.14.0)

## Instalação

Como usar nosso projeto localmente.

```bash
git clone https://github.com/CTISM-Prof-Henry/trab-final-spi-docker-com-poze.git
```

## Instruções de Uso

Abra a pasta do projeto, e siga os comandos.

Dentro da pasta do frontend, para rodar é necessario:

```bash
npm i
```

```bash
npm run start
```

Já no backend é necessario um terminal aberto para: <br>
 * Docker <br>
 * Backend em si

Para rodar o banco (Lembrando que deve estar dentro da pasta backend):
```bash
docker compose up
```

E no outro terminal (com o banco de dados já levantado pelo container do docker)
```bash
npm i
```

```bash
npx prisma migrate dev
```

```bash
npm run start
```

Agora, pra popular o banco de dados, é só dar uma requisição do tipo get
para o nosso backend /users/populate que fica na porta 9079, ou seja, cola no navegador
```
http://localhost:9079/users/populate
```

## Contato

O repositório foi originalmente desenvolvido por time gue10: [joao.guedes@acad.ufsm.br]()
