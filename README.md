# Portal Cajual 🌴

Portal oficial do **Festival do Cajual** — uma plataforma web para os frequentadores do festival compartilharem fotos e vivenciarem a festa de forma interativa e colaborativa.

**[🔗 Acesse o projeto ao vivo](https://cajualfest.com)**

---

## 📸 Sobre o Projeto

O Portal Cajual é uma aplicação web desenvolvida para o Festival do Cajual, permitindo que os participantes publiquem e visualizem fotos do evento em tempo real. O projeto nasceu da vontade de unir código e cultura, criando uma experiência digital que complementa a alegria do festival.

A plataforma conta com autenticação de usuários, galeria de fotos colaborativa e uma página institucional apresentando a equipe por trás do projeto.

---

## 🚀 Funcionalidades

- **Galeria colaborativa** — visualização das fotos publicadas pelos participantes do festival
- **Publicação de fotos** — usuários autenticados podem compartilhar suas fotos diretamente pela plataforma
- **Autenticação** — sistema de login via NextAuth para controle de acesso à galeria e publicação
- **Página Sobre Nós** — apresentação da equipe desenvolvedora do projeto
- **Interface responsiva** — experiência otimizada para mobile e desktop

---

## 🛠️ Tecnologias Utilizadas

**Linguagem**
- TypeScript

**Frontend**
- Next.js 15 (com Turbopack)
- React 19
- Tailwind CSS 4

**Autenticação**
- NextAuth v4

**Bibliotecas de apoio**
- Axios — requisições HTTP
- Lucide React — ícones
- React Hot Toast — notificações
- React Swipeable — gestos de swipe para mobile

**Infraestrutura**
- Docker e Docker Compose — ambiente de desenvolvimento local
- Vercel — deploy e hospedagem

---

## ⚙️ Como Executar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v20 ou superior)
- [Docker](https://www.docker.com/) e Docker Compose (opcional)

### Com Docker

```bash
# Clone o repositório
git clone https://github.com/argemiroanjos/portal-cajual.git
cd portal-cajual

# Suba os containers
docker-compose up --build
```

A aplicação estará disponível em **http://localhost:3000**.

### Sem Docker

```bash
# Clone o repositório
git clone https://github.com/argemiroanjos/portal-cajual.git
cd portal-cajual

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env
# Preencha as variáveis necessárias no arquivo .env

# Rode em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:3000**.

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
NEXTAUTH_SECRET=sua_secret_aqui
NEXTAUTH_URL=http://localhost:3000
```

---

## 📁 Estrutura do Projeto

```
portal-cajual/
├── public/          # Arquivos estáticos e assets
├── src/             # Código-fonte da aplicação
├── Dockerfile
├── docker-compose.yml
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## 👨‍💻 Autores

**Argemiro dos Anjos** — Desenvolvedor Fullstack
- GitHub: [@argemiroanjos](https://github.com/argemiroanjos)
- LinkedIn: [Argemiro dos Anjos](https://www.linkedin.com/in/argemiro-dos-anjos)

**Herick Moreira** — Desenvolvedor Fullstack
- GitHub: [@Herick2D](https://github.com/Herick2D)
- LinkedIn: [Herick Moreira](https://www.linkedin.com/in/herick-moreira/)
