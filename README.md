# 🏍️ MotoTrack — Plataforma de Monitoramento de Motoboys em Tempo Real

<p align="center">
  <img src="https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring%20Boot-3.3.2-brightgreen?style=for-the-badge&logo=springboot" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" />
  <img src="https://img.shields.io/badge/WebSocket-STOMP-blueviolet?style=for-the-badge&logo=socketdotio" alt="WebSocket STOMP" />
</p>

---

## 📋 Sobre o Projeto

O **MotoTrack** é uma solução corporativa de alta performance para monitoramento e rastreamento de entregas por motoboys em tempo real. A plataforma permite gerenciar pedidos, alocar entregadores, atualizar o status das rotas e rastrear graficamente a geolocalização dos motoboys no mapa à medida que as coordenadas são transmitidas via conexões WebSocket bidirecionais estáveis.

O ecossistema divide-se em um **Backend robusto em Java com Spring Boot** (responsável pelo gerenciamento transacional de dados e mensageria WebSocket) e um **Frontend moderno em React com TypeScript** inspirado nos melhores dashboards SaaS de observabilidade logística do mercado.

---

## ✨ Funcionalidades Principais

### 📊 Dashboard Operacional (Overview)
- Métricas consolidadas em tempo real: *Total de Entregas*, *Em Trânsito*, *Concluídas* e *Falhas/Atrasos*.
- Gráfico dinâmico de produtividade integrando volumes de entregas e localizações transmitidas por hora.
- Timeline de alertas rápidos e listagem reativa das últimas ações do sistema.

### 🚴 Painel de Gestão Logística (Entregas)
- Controle do ciclo de vida das entregas: Criação, Inicialização da rota (`CRIADO` -> `EM_ROTA`), Conclusão, Cancelamento e Registro de falhas.
- Badges de status dinâmicos e informativos.
- Filtros por ID e situação logística com carregamentos assíncronos fluidos.

### 📍 Mapa de Rastreamento Geográfico (Mapa)
- Renderização baseada em **Leaflet** com visual dark minimalista.
- Atualização em tempo real da posição dos entregadores ativos sem recarregar a tela.
- Ajuste automático de zoom de acordo com o agrupamento dos pontos de entrega.

### 📡 Console de Monitoramento e Testes WebSocket
- Timeline de eventos com transições suaves (**Framer Motion**) separando logs de conexão, inscrições e geolocalizações recebidas.
- Formulário operacional de simulação: possibilita simular um entregador enviando coordenadas GPS (`Latitude` e `Longitude`) para tópicos ativos e ver o resultado imediato no mapa.

### ⚙️ Administração e Configurações (Config)
- CRUD completo de **Pedidos** (Cliente, Endereço de Entrega, Status).
- CRUD completo de **Entregadores** (Nome, Telefone, Disponibilidade).

---

## 🏗 Arquitetura do Sistema

```
                        ┌─────────────────────────────────┐
                        │      MotoTrack React Client     │
                        │       (Vite + TS + Tailwind)    │
                        └───────┬─────────────────▲───────┘
                                │                 │
                       REST API │                 │ WebSocket
                       (JSON)   │                 │ (STOMP / SockJS)
                                ▼                 │
                        ┌─────────────────────────┴───────┐
                        │     Spring Boot Rest Controller │
                        ├─────────────────────────────────┤
                        │     Spring WebSocket Broker     │
                        └───────┬─────────────────▲───────┘
                                │                 │
                   JPA & Driver │                 │ 
                                ▼                 │
                        ┌─────────────────────────┴───────┐
                        │            PostgreSQL           │
                        └─────────────────────────────────┘
```

### Protocolo de Comunicação WebSocket
- **Endpoint Principal**: `/ws` (com suporte a SockJS fallback)
- **Canal de Inscrição**: `/topic/entregas/{entregaId}` (recebimento de geolocalizações em tempo real)
- **Canal de Envio**: `/app/entregas/{entregaId}/localizacao` (transmissão de coordenadas do entregador)

---

## 🛠 Stack Tecnológica

### Backend (API & WebSocket Broker)
- **Java 21 LTS**
- **Spring Boot 4.1.x**
- **Spring Data JPA** (Persistência de Dados)
- **Spring WebSocket** (Broker simples de mensageria com STOMP)
- **H2 Database / PostgreSQL** (Bancos suportados)
- **Maven** (Gerenciamento de Dependências)

### Frontend (Dashboard Dashboard SaaS)
- **React 19** & **TypeScript**
- **Vite** (Build Tool e Servidor de Desenvolvimento super rápido)
- **Tailwind CSS v4** (Estilização baseada em tokens com tema Dark elegante)
- **Framer Motion** (Micro-animações de eventos logísticos)
- **Leaflet & React Leaflet** (Mapas interativos)
- **Recharts** (Visualização gráfica da atividade de entregas)
- **@stomp/stompjs & sockjs-client** (Cliente robusto de WebSocket)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **JDK 21** instalado
- **Node.js 18+** instalado

---

### Passo 1: Executar o Backend (Spring Boot)

1. Entre no diretório raiz do projeto.
2. Certifique-se de configurar a variável `JAVA_HOME` para o JDK 21 se o terminal não o encontrar.
3. A aplicação agora está configurada para usar **PostgreSQL** por padrão. Você precisa ter o PostgreSQL instalado e rodando.
4. Crie um banco de dados chamado `entregas_api` no seu pgAdmin.
5. Se necessário, ajuste a senha no arquivo `src/main/resources/application.properties`.
6. Execute o Maven Wrapper para iniciar a API:
   ```bash
   .\mvnw spring-boot:run
   ```
7. A API estará pronta e escutando na porta **`http://localhost:8080`**.

---

### Passo 2: Executar o Frontend (React + Vite)

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. O painel estará disponível para acesso em:
   👉 **[http://localhost:5173]http://localhost:5173**

---

## 🧑‍💻 Autores
- **Alexsander Santos** -  Desenvolvedor & Mantenedor [LinkedIn](https://www.linkedin.com/in/alexsander-santos-b010051b5)
- **Wallace Coimbra** - Desenvolvedor & Mantenedor [LinkedIn](www.linkedin.com/in/wallace-coimbra2105)
