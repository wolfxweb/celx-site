import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
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

export default function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/v1/blog/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Post não encontrado')
        return r.json()
      })
      .then(d => {
        setPost(d)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <>
        <Nav />
        <div className="blogpost-loading">Carregando...</div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Nav />
        <div className="blogpost-error">
          <h1>Post não encontrado</h1>
          <p>{error}</p>
          <Link to="/blog" className="blogpost-back">← Voltar ao blog</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Nav />
      <article className="blogpost">
        <div className="blogpost-inner">
          <Link to="/blog" className="blogpost-back">← Voltar ao blog</Link>

          {post.cover_url && (
            <div className="blogpost-cover" style={{ backgroundImage: `url(${post.cover_url})` }} />
          )}

          <div className="blogpost-meta">
            {post.tags && post.tags.map(tag => (
              <span key={tag} className="blogpost-tag">{tag}</span>
            ))}
            <span className="blogpost-date">
              {new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 className="blogpost-title">{post.title}</h1>
          <p className="blogpost-excerpt">{post.excerpt}</p>

          <div className="blogpost-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
      <Footer />
    </>
  )
}
