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
  const coverStyle = hero.cover_url
    ? {
        backgroundImage: `url(${hero.cover_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}

  return (
    <section className="hero" style={{ paddingTop: '8rem', paddingBottom: '4rem' }}>
      <div className="hero-text">
        <span className="hero-tag fade-up">{hero.tag}</span>
        <h1 className="fade-up" dangerouslySetInnerHTML={{ __html: hero.title }} />
        <p className="hero-sub fade-up">{hero.subtitle}</p>
        <div className="hero-actions fade-up">
          <a href="/#contato" className="btn-primary">{hero.cta_text}</a>
          <a href="/#sobre" className="btn-ghost">{hero.cta_secondary}</a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="avatar-frame">
          {hero.cover_url ? (
            <img src={hero.cover_url} alt="Capa" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : hero.avatar_url ? (
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

function LivroSection({ livro }) {
  return (
    <section id="livro" style={{ background: 'var(--black)', color: 'var(--white)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#f0a500', marginBottom: '0.75rem', fontWeight: 500 }}>
            {livro.serie}
          </p>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2.2rem', lineHeight: 1.15, marginBottom: '0.5rem', color: 'var(--white)' }}>
            {livro.title}
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(244,246,251,0.6)', marginBottom: '1.5rem', fontWeight: 300 }}>
            {livro.subtitle}
          </p>
          <p style={{ fontSize: '0.9rem', color: 'rgba(244,246,251,0.75)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            {livro.description}
          </p>
          <a
            href={livro.amazon_url}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#f0a500',
              color: 'var(--black)',
              padding: '0.75rem 1.5rem',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            📖 {livro.cta_text} →
          </a>
        </div>
        <div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(244,246,251,0.5)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            O que você vai aprender
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {livro.bullets.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem', color: 'rgba(244,246,251,0.85)' }}>
                <span style={{ color: '#f0a500', fontSize: '1.1rem', lineHeight: '1.4rem' }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(244,246,251,0.1)', fontSize: '0.82rem', color: 'rgba(244,246,251,0.4)' }}>
            Por <strong style={{ color: 'rgba(244,246,251,0.7)' }}>{livro.author}</strong> · eBook Kindle
          </p>
        </div>
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
          <a href="/#contato" className="btn-contato-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Vamos conversar sobre o seu projeto →
          </a>
        </div>
      </div>
    </div>
  )
}

function ContatoSection({ contato }) {
  return (
    <div className="contato-section" id="contato">
      <div className="contato-inner">
        <p className="section-eyebrow">Contato</p>
        <h2 className="contato-title" dangerouslySetInnerHTML={{ __html: contato.title }} />
        <p className="contato-sub">{contato.subtitle}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem' }}>
          <a href={contato.whatsapp_url} className="btn-contato-primary" target="_blank" rel="noreferrer">
            💬 WhatsApp
          </a>
          <a href={contato.linkedin_url} className="btn-contato-ghost" target="_blank" rel="noreferrer">
            💼 LinkedIn
          </a>
          <a href={contato.instagram_url} className="btn-contato-ghost" target="_blank" rel="noreferrer">
            📸 Instagram
          </a>
          <a href={contato.tiktok_url} className="btn-contato-ghost" target="_blank" rel="noreferrer">
            🎵 TikTok
          </a>
        </div>
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
        <li><a href="https://www.linkedin.com/in/carloslobo/" target="_blank" rel="noreferrer">LinkedIn</a></li>
        <li><a href="https://www.instagram.com/carloslobo.tech/" target="_blank" rel="noreferrer">Instagram</a></li>
        <li><a href="https://www.tiktok.com/@carloslobo.tech" target="_blank" rel="noreferrer">TikTok</a></li>
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
      <LivroSection livro={data.livro} />
      <ServicosSection servicos={data.servicos} />
      <Sep />
      <ContatoSection contato={data.contato} />
      <Footer />
    </>
  )
}
