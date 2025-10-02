[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/agg6sSBC)
# Título do repositório

Descrição curta do repositório.

## Sumário

* [Pré-requisitos](#pré-requisitos)
* [Instalação](#instalação)
* [Instruções de uso](#instruções-de-uso)
* [Contato](#contato)
* [Bibliografia](#bibliografia)

## Pré-requisitos

Descreva aqui brevemente os pré-requisitos necessários para executar o código-fonte. Descreva também
a configuração mínima da máquina em que o código foi desenvolvido, e se alguma configuração em particular é essencial
para sua execução (por exemplo, placa de vídeo dedicada):

| Configuração        | Valor                    |
|---------------------|--------------------------|
| Sistema operacional | Windows 10 Pro (64 bits) |
| Processador         | Intel core i7 9700       |
| Memória RAM         | 16GB                     |
| Necessita rede?     | Sim                      |

Apps necessários:
 * Docker
 * Node (22.14.0)

## Instalação

Descreva aqui as instruções para instalação das ferramentas para execução do código-fonte: 

```bash
git clone https://github.com/CTISM-Prof-Henry/trab-final-spi-docker-com-poze.git
```

## Instruções de Uso

Descreva aqui o passo-a-passo que outros usuários precisam realizar para conseguir executar com sucesso o código-fonte
deste projeto:

Abra a pasta do projeto, e siga os comandos.

Dentro da pasta do frontend, para rodar é necessario:

```bash
npm i
```

```bash
npm run start
```

Já no backend é necessario um terminal aberto para:
 * Docker
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

## Contato

O repositório foi originalmente desenvolvido por Fulano: [fulano@ufsm.br]()

## Bibliografia

Adicione aqui entradas numa lista com a documentação pertinente:

* [Documentação coplin-db2](https://pypi.org/project/coplin-db2/