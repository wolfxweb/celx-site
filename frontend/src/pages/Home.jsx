import { useState } from 'react'
import Nav from '../components/Nav'
import { usePageContent } from '../hooks/usePageContent'

function AvatarIcon() {
  return (
    <div className="avatar-icon">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
    </div>
  )
}

function HeroSection({ hero }) {
  return (
    <section className="hero" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div className="hero-text">
        <span className="hero-tag fade-up">{hero.tag}</span>
        <h1 className="fade-up" dangerouslySetInnerHTML={{ __html: hero.title }} />
        <p className="hero-sub fade-up">{hero.subtitle}</p>
        <div className="hero-actions fade-up">
          <a href="#contato" className="btn-primary">{hero.cta_text}</a>
          <a href="#sobre" className="btn-ghost">{hero.cta_secondary}</a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="avatar-frame">
          {hero.avatar_url ? (
            <img src={hero.avatar_url} alt="Carlos Eduardo Lobo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="avatar-placeholder">
              <AvatarIcon />
              Sua foto aqui
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      {stats.items.map((item, i) => (
        <div className="stat" key={i}>
          <span className="stat-num">{item.value}</span>
          <span className="stat-label">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

function SobreSection({ sobre }) {
  return (
    <section id="sobre">
      <div className="sobre-grid">
        <div className="sobre-sticky">
          <p className="section-eyebrow">Sobre mim</p>
          <h2 className="section-title" dangerouslySetInnerHTML={{ __html: sobre.sticky_title }} />
        </div>
        <div className="sobre-body">
          {sobre.paragraphs.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
      </div>
    </section>
  )
}

function EspecialidadesSection({ especialidades }) {
  return (
    <div className="esp-section">
      <div className="esp-inner">
        <p className="section-eyebrow">Especialidades</p>
        <h2 className="section-title">O que eu realmente domino</h2>
        <div className="esp-grid">
          {especialidades.cards.map((card, i) => (
            <div className="esp-card" key={i}>
              <span className="esp-num">{card.num}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PortfolioSection({ portfolio }) {
  return (
    <section id="portfolio">
      <div className="artigos-header">
        <div>
          <p className="section-eyebrow">Portfólio</p>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Projetos <em>reais</em></h2>
        </div>
        <a href="https://github.com/wolfxweb" className="artigos-link" target="_blank" rel="noreferrer">Ver tudo no GitHub</a>
      </div>
      <div className="projects-grid">
        {portfolio.projects.map((proj, i) => (
          <a href={proj.url} key={i} className="artigo-card featured" style={{ minHeight: 220 }} target="_blank" rel="noreferrer">
            <div>
              <p className="artigo-tag">{proj.tag}</p>
              <h3>{proj.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', marginTop: '0.75rem', fontWeight: 300, lineHeight: 1.6 }}>{proj.description}</p>
            </div>
            <span className="artigo-arrow">→ ver projeto</span>
          </a>
        ))}
      </div>
    </section>
  )
}

function ArtigosSection({ artigos }) {
  return (
    <section id="conteudo">
      <div className="artigos-header">
        <div>
          <p className="section-eyebrow">Conteúdo</p>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Reflexões e <em>aprendizados</em></h2>
        </div>
        <a href="https://linkedin.com" className="artigos-link" target="_blank" rel="noreferrer">Ver tudo no LinkedIn</a>
      </div>
      <div className="artigos-grid">
        {artigos.articles.map((art, i) => (
          <a href={art.url} key={i} className={`artigo-card${i === 0 ? ' featured' : ''}`}>
            <div>
              <p className="artigo-tag">{art.tag}</p>
              <h3>{art.title}</h3>
            </div>
            <span className="artigo-arrow">→</span>
          </a>
        ))}
      </div>
    </section>
  )
}

function ServicosSection({ servicos }) {
  return (
    <div className="servicos-section" id="servicos">
      <div className="servicos-inner">
        <p className="section-eyebrow">O que eu faço</p>
        <h2 className="section-title">
          Sistemas e consultorias<br />
          <em>para quem precisa de resultado.</em>
        </h2>
        <div className="servicos-grid">
          {servicos.services.map((svc, i) => (
            <div className="servico-card" key={i}>
              <span className="servico-card-pill">{svc.num}</span>
              <h3>{svc.title}</h3>
              <p>{svc.description}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <a href="#contato" className="btn-contato-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Vamos conversar sobre o seu projeto →
          </a>
        </div>
      </div>
    </div>
  )
}

function ContatoSection({ contato }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'success' | 'error' | null

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    try {
      const r = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!r.ok) throw new Error('Erro ao enviar')
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="contato-section" id="contato">
      <div className="contato-inner">
        <p className="section-eyebrow">Contato</p>
        <h2 className="contato-title" dangerouslySetInnerHTML={{ __html: contato.title }} />
        <p className="contato-sub">{contato.subtitle}</p>
        <div className="contato-buttons">
          <a href={contato.whatsapp_url} className="btn-contato-primary" target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={contato.linkedin_url} className="btn-contato-ghost" target="_blank" rel="noreferrer">LinkedIn</a>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} style={{ marginTop: '3rem' }}>
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              required
              placeholder="Seu nome"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Mensagem</label>
            <textarea
              required
              placeholder="Conte-me sobre seu projeto..."
              value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            />
          </div>
          <button type="submit" className="admin-save-btn" style={{ width: '100%', background: 'var(--white)', color: 'var(--black)' }}>
            Enviar mensagem
          </button>
          {status === 'success' && <div className="form-success">Mensagem enviada com sucesso!</div>}
          {status === 'error' && <div className="form-error">Erro ao enviar. Tente novamente.</div>}
        </form>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer>
      <p>© 2026 Carlos Eduardo Lobo</p>
      <ul className="footer-links">
        <li><a href="https://www.wolfx.com.br" target="_blank" rel="noreferrer">Wolfx</a></li>
        <li><a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a href="https://wa.me/5548988114708" target="_blank" rel="noreferrer">WhatsApp</a></li>
      </ul>
    </footer>
  )
}

function Sep() {
  return <div className="sep" />
}

export default function Home() {
  const { data, loading, error } = usePageContent()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--gray)', fontFamily: 'var(--sans)' }}>
        Carregando...
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: '#ff6b6b', fontFamily: 'var(--sans)' }}>
        Erro ao carregar conteúdo: {error}
      </div>
    )
  }

  return (
    <>
      <Nav />
      <HeroSection hero={data.hero} />
      <StatsBar stats={data.stats} />
      <Sep />
      <SobreSection sobre={data.sobre} />
      <Sep />
      <EspecialidadesSection especialidades={data.especialidades} />
      <Sep />
      <PortfolioSection portfolio={data.portfolio} />
      <Sep />
      <ArtigosSection artigos={data.artigos} />
      <Sep />
      <ServicosSection servicos={data.servicos} />
      <Sep />
      <ContatoSection contato={data.contato} />
      <Footer />
    </>
  )
}
