import { useState, useEffect } from 'react'
import Nav from '../components/Nav'

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

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/v1/blog/posts')
      .then(r => {
        if (!r.ok) throw new Error('Erro ao carregar posts')
        return r.json()
      })
      .then(d => {
        setPosts(d)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Nav />
      <div className="blog-page">
        <div className="blog-header">
          <p className="section-eyebrow">Blog</p>
          <h1 className="section-title">Reflexões e <em>aprendizados</em></h1>
          <p className="blog-subtitle">Compartilho aqui ideias, estudos e descobertas sobre tecnologia, sistemas e desenvolvimento de projetos.</p>
        </div>

        {loading && (
          <div className="blog-loading">Carregando...</div>
        )}

        {error && (
          <div className="blog-error">Erro: {error}</div>
        )}

        {!loading && !error && (
          <div className="blog-grid">
            {posts.map((post, i) => (
              <a href={`/blog/${post.slug}`} key={post.id} className={`blog-card${i === 0 ? ' featured' : ''}`}>
                {post.cover_url && (
                  <div className="blog-card-cover" style={{ backgroundImage: `url(${post.cover_url})` }} />
                )}
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    {post.tags && post.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="blog-tag">{tag}</span>
                    ))}
                    <span className="blog-date">{new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <span className="blog-card-arrow">Ler mais →</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
