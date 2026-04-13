# SPEC.md — celx-site

## 1. Concept & Vision

Site institucional para Carlos Eduardo Lobo — desenvolvedor sênior e consultor de IA aplicada.
O site funciona como um funil silencioso: projeta autoridade técnica, apresenta portfólio/produtos,
e converte visitantes em contatos qualificados (WhatsApp, LinkedIn, formulário).

**Stack:** React (frontend) + FastAPI (backend/CMS) + PostgreSQL + Docker Swarm (deploy)

---

## 2. Design Language

O design já existe em HTML estático e será migrado fielmente para React.
Qualquer evolução visual deve manter a mesma alma: minimalismo editorial, tipografia serif + sans, paleta dark-navy.

### Paleta
```
--black:       #0f1f3d   (fundo escuro, nav, seções dark)
--white:       #f4f6fb   (fundo claro)
--gray:        #7a8299
--gray-light:  #dde2ef
--gray-mid:    #c2cade
--accent:      #1a3a6b
--accent-light:#e4eaf7
```

### Tipografia
- **Serif:** Instrument Serif (Google Fonts) — títulos, destaques
- **Sans:** DM Sans (Google Fonts) — corpo, UI

### Espaciamento
- Seções: `7rem` padding vertical
- Container max-width: `1200px`
- Border-radius cards: `16px` / botões: `100px`

---

## 3. Layout & Structure

### Páginas
1. **`/` — Home** (single page, seções em scroll)
2. **`/admin` — CMS Admin** (protegido por auth)

### Seções do Home (single-page scroll)
1. Nav (fixed, blur backdrop)
2. Hero — headline, sub, CTA, avatar placeholder
3. Stats Bar (dark background)
4. Sobre (grid 2 colunas: sticky left, texto right)
5. Especialidades (background #f0ede6, 4 cards)
6. Portfólio (grid de projetos — links externos)
7. Conteúdo/Artigos (grid 3 colunas, link para LinkedIn)
8. Serviços (4 cards dark, com CTA central)
9. Contato (dark, centralizado, botões WhatsApp + LinkedIn)
10. Footer

### Responsive
- Mobile-first com breakpoints em `900px`
- Hero grid → 1 coluna (oculta avatar)
- Artigos 3 col → 1 col
- Serviços 2 col → 1 col

---

## 4. Features & Interactions

### Frontend (React)
- **Single Page Application** com scroll suave entre seções
- **Nav fixo** com links âncora + CTA "Contratar"
- **Formulário de contato** → POST `/api/v1/contact` → notificação Telegram
- **Avatar placeholder** com SVG icon (substituível por upload de imagem no CMS)
- **Animações fade-up** CSS em elementos hero

### Backend (FastAPI)
- **CMS Admin** para editar conteúdo de cada seção
- **Auth JWT** para o admin (/admin/login)
- **Endpoints públicos:**
  - `GET /api/v1/pages/home` — retorna todo o conteúdo do home
  - `POST /api/v1/contact` — envía mensagem e notifica Telegram
- **Endpoints admin (auth required):**
  - `CRUD` para cada seção (hero, sobre, especialidades, portfolio, artigos, serviços, contato)
  - `POST /api/v1/admin/upload/avatar` — upload da foto de perfil

### Modelos de Dados (PostgreSQL)

```sql
-- Tabela principal de conteúdo (JSONB para flexibilidade)
CREATE TABLE page_content (
    id SERIAL PRIMARY KEY,
    section VARCHAR(50) UNIQUE NOT NULL,  -- 'hero', 'sobre', 'especialidades', etc.
    content JSONB NOT NULL,                -- conteúdo estruturado por seção
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Mensagens de contato
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    notified_telegram BOOLEAN DEFAULT FALSE
);

-- Admin users
CREATE TABLE admin_users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Secções CMS (content JSONB por seção)

**hero:**
```json
{ "tag": "...", "title": "...", "subtitle": "...", "cta_text": "...", "avatar_url": "..." }
```

**sobre:** `{ "sticky_title": "...", "paragraphs": ["...", "..."] }`

**especialidades:** `{ "cards": [{ "num": "01", "title": "...", "description": "..." }] }`

**portfolio:** `{ "projects": [{ "tag": "...", "title": "...", "description": "...", "url": "..." }] }`

**artigos:** `{ "articles": [{ "tag": "...", "title": "...", "url": "..." }] }`

**servicos:** `{ "services": [{ "num": "01", "title": "...", "description": "..." }] }`

**contato:** `{ "title": "...", "subtitle": "...", "whatsapp_url": "...", "linkedin_url": "..." }`

**stats:** `{ "items": [{ "value": "...", "label": "..." }] }`

---

## 5. Component Inventory

### Frontend Components
- `<Nav>` — fixed, blur, logo + links + CTA
- `<HeroSection>` — tag, title (com em italic), subtitle, CTAs, avatar
- `<StatsBar>` — 4 stat items em row
- `<SobreSection>` — grid 2 cols, sticky left
- `<EspecialidadesSection>` — bg #f0ede6, 4 cards grid
- `<PortfolioSection>` — project cards com link externo
- `<ArtigosSection>` — 3 col articles grid
- `<ServicosSection>` — dark bg, 4 service cards
- `<ContatoSection>` — dark, centered, WhatsApp + LinkedIn buttons
- `<Footer>` — copyright + links
- `<ContactForm>` — nome, email, mensagem → POST /api/v1/contact

### Admin Components
- `<LoginPage>` — email + password → JWT
- `<AdminLayout>` — sidebar + content area
- `<SectionEditor>` — editor genérico por seção (form com JSON preview)
- `<AvatarUploader>` — upload de imagem

---

## 6. Technical Approach

### Repositório
```
celx-site/
├── frontend/          # React (Vite)
├── backend/           # FastAPI
├── docker-compose.yml
└── Dockerfile
```

### Backend Stack
- **FastAPI** com SQLAlchemy + asyncpg
- **PostgreSQL** (já existe — reuse instance)
- **JWT auth** com python-jose
- **Telegram notifications** via bot (mesmo @celxarchitectbot)
- **Admin CMS** — pages/react/admin para edição

### Frontend Stack
- **React 18** + Vite
- **React Router** (2 rotas: / e /admin)
- **CSS puro** (manter o design system do HTML original — não trocar por Tailwind)
- **Fetch API** para comunicação com backend

### Deploy (Docker Swarm)
- **Serviço `celx-frontend`**: nginx servindo build do React em `/app`
- **Serviço `celx-backend`**: FastAPI + Uvicorn
- **Traefik** routing:
  - `celx.com.br` → frontend
  - `api.celx.com.br` → backend
- Build local → `docker build` → `docker service update --image` (pattern igual wolfx-atendimento)
- **DB**: reuse existing PostgreSQL container (não criar novo)

### Variáveis de Ambiente Backend
```
DATABASE_URL=postgresql+asyncpg://postgres:postgres123@postgres:5432/celx_site
JWT_SECRET=<generated>
TELEGRAM_BOT_TOKEN=8312031269:AAFto1ZfqRbj3e4mWYEBsV4KgaJ7GLGgVJ8
TELEGRAM_CHAT_ID=1229273513
CORS_ORIGIN=https://celx.com
```

### Seed Admin (idempotente)
- Admin inicial: `carlos@celx.com` / `AdminCelx@123`
- Seed não recria se já existir (check individual por entity)
