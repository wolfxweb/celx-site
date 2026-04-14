import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/usePageContent'

const SECTIONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'stats', label: 'Stats' },
  { key: 'sobre', label: 'Sobre' },
  { key: 'especialidades', label: 'Especialidades' },
  { key: 'portfolio', label: 'Portfólio' },
  { key: 'livro', label: 'Livro' },
  { key: 'servicos', label: 'Serviços' },
  { key: 'contato', label: 'Contato' },
]

export default function Admin() {
  const navigate = useNavigate()
  const { fetchSections, updateSection, fetchContacts } = useAdminAuth()
  const [activeSection, setActiveSection] = useState('hero')
  const [sections, setSections] = useState({})
  const [contacts, setContacts] = useState([])
  const [editJson, setEditJson] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [savingLogo, setSavingLogo] = useState(false)
  const [tab, setTab] = useState('sections') // 'sections' | 'contacts' | 'blog'

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const secs = await fetchSections()
      const secsMap = {}
      secs.forEach(s => { secsMap[s.section] = s.content })
      setSections(secsMap)
      if (!secs.find(s => s.section === activeSection)) {
        // Load default from API
        const home = await fetch('/api/v1/pages/home').then(r => r.json())
        setEditJson(JSON.stringify(home[activeSection] || {}, null, 2))
      } else {
        setEditJson(JSON.stringify(secsMap[activeSection] || {}, null, 2))
      }
      const msgs = await fetchContacts()
      setContacts(msgs)
    } catch {
      navigate('/admin/login')
    }
  }

  function handleSectionChange(key) {
    setActiveSection(key)
    setSaveMsg('')
    const content = sections[key]
    setEditJson(content ? JSON.stringify(content, null, 2) : JSON.stringify({}, null, 2))
  }

  async function handleSave() {
    setSaving(true)
    setSaveMsg('')
    try {
      const content = JSON.parse(editJson)
      await updateSection(activeSection, content)
      setSections(prev => ({ ...prev, [activeSection]: content }))
      setSaveMsg('✓ Salvo com sucesso!')
    } catch (err) {
      setSaveMsg(`✗ Erro: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  function handleLogout() {
    localStorage.removeItem('celx_token')
    navigate('/admin/login')
  }

  // Blog Tab Component
  function BlogTab() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingPost, setEditingPost] = useState(null)
    const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', cover_url: '', author: '' })
    const [uploadingCover, setUploadingCover] = useState(false)
    const [savingPost, setSavingPost] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(() => {
      if (tab === 'blog') loadPosts()
    }, [tab])

    async function loadPosts() {
      setLoading(true)
      try {
        const res = await fetch('/api/v1/blog/admin/posts', {
          headers: { Authorization: `Bearer ${localStorage.getItem('celx_token')}` }
        })
        const data = await res.json()
        setPosts(data.posts || [])
      } catch {
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    async function handleUploadCover(file) {
      setUploadingCover(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'blog')
        const res = await fetch('/api/v1/blog/admin/upload?folder=blog', {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('celx_token')}` },
          body: formData
        })
        const data = await res.json()
        setForm(f => ({ ...f, cover_url: data.url }))
        setMsg('✓ Imagem carregada!')
      } catch {
        setMsg('✗ Erro ao carregar imagem')
      } finally {
        setUploadingCover(false)
        setTimeout(() => setMsg(''), 3000)
      }
    }

    async function handleUploadLogo(file) {
      setSavingLogo(true)
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'logos')
        const res = await fetch('/api/v1/blog/admin/upload?folder=logos', {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('celx_token')}` },
          body: formData
        })
        const data = await res.json()
        // Update hero section with logo_url
        const heroContent = sections.hero || {}
        const updatedHero = { ...heroContent, logo_url: data.url }
        await updateSection('hero', updatedHero)
        setSections(prev => ({ ...prev, hero: updatedHero }))
        setEditJson(JSON.stringify(updatedHero, null, 2))
        setMsg('✓ Logo carregado e salvo!')
      } catch {
        setMsg('✗ Erro ao carregar logo')
      } finally {
        setSavingLogo(false)
        setTimeout(() => setMsg(''), 3000)
      }
    }

    function openEdit(post) {
      setEditingPost(post)
      setForm({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        cover_url: post.cover_url || '',
        author: post.author || ''
      })
      setShowForm(true)
    }

    function openNew() {
      setEditingPost(null)
      setForm({ title: '', slug: '', excerpt: '', content: '', cover_url: '', author: '' })
      setShowForm(true)
    }

    function generateSlug(title) {
      return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    async function handleSubmit(e) {
      e.preventDefault()
      setSavingPost(true)
      setMsg('')
      try {
        const token = localStorage.getItem('celx_token')
        const url = editingPost
          ? `/api/v1/blog/admin/posts/${editingPost.id}`
          : '/api/v1/blog/admin/posts'
        const method = editingPost ? 'PUT' : 'POST'
        const payload = { ...form, slug: form.slug || generateSlug(form.title) }
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        })
        if (!res.ok) throw new Error('Erro ao salvar')
        setMsg('✓ Post salvo com sucesso!')
        setShowForm(false)
        loadPosts()
      } catch (err) {
        setMsg(`✗ ${err.message}`)
      } finally {
        setSavingPost(false)
        setTimeout(() => setMsg(''), 3000)
      }
    }

    async function handleDelete(id) {
      if (!confirm('Excluir este post?')) return
      try {
        await fetch(`/api/v1/blog/admin/posts/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('celx_token')}` }
        })
        loadPosts()
      } catch {}
    }

    return (
      <>
        <h1>Blog</h1>
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="admin-save-btn" onClick={openNew}>+ Novo Post</button>
          {msg && <span style={{ fontSize: '0.85rem', color: msg.startsWith('✓') ? 'green' : 'red' }}>{msg}</span>}
        </div>

        {loading ? (
          <p style={{ color: 'var(--gray)' }}>Carregando...</p>
        ) : posts.length === 0 ? (
          <p style={{ color: 'var(--gray)' }}>Nenhum post ainda.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {posts.map(post => (
              <div key={post.id} className="admin-section-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem' }}>{post.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                    {post.author} • {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </p>
                  {post.cover_url && (
                    <img src={post.cover_url} alt="" style={{ width: 80, height: 50, objectFit: 'cover', borderRadius: 4, marginTop: '0.5rem' }} />
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => openEdit(post)} style={{ padding: '0.4rem 0.8rem', borderRadius: 6, border: '1px solid var(--gray-light)', background: 'var(--white)', cursor: 'pointer', fontSize: '0.8rem' }}>Editar</button>
                  <button onClick={() => handleDelete(post.id)} style={{ padding: '0.4rem 0.8rem', borderRadius: 6, border: '1px solid #e74c3c', background: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '0.8rem' }}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'var(--white)', borderRadius: 12, padding: '2rem', width: '90%', maxWidth: 700, maxHeight: '90vh', overflow: 'auto' }}>
              <h2 style={{ marginBottom: '1.5rem' }}>{editingPost ? 'Editar Post' : 'Novo Post'}</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>Título</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid var(--gray-light)', fontSize: '0.9rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>Slug</label>
                  <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-gerado se vazio" style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid var(--gray-light)', fontSize: '0.9rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>Autor</label>
                  <input type="text" value={form.author} onChange={e => setForm(f => ({ ...f, author: e.target.value }))} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid var(--gray-light)', fontSize: '0.9rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>Resumo</label>
                  <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={2} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid var(--gray-light)', fontSize: '0.9rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>Conteúdo</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={6} style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid var(--gray-light)', fontSize: '0.9rem' }} />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', fontWeight: 500 }}>Imagem de Capa</label>
                  <input type="file" accept="image/*" onChange={e => e.target.files[0] && handleUploadCover(e.target.files[0])} disabled={uploadingCover} style={{ fontSize: '0.85rem' }} />
                  {uploadingCover && <span style={{ fontSize: '0.8rem', color: 'var(--gray)', marginLeft: '0.5rem' }}>Enviando...</span>}
                  {form.cover_url && <img src={form.cover_url} alt="" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, marginTop: '0.5rem', display: 'block' }} />}
                  <input type="text" value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} placeholder="Ou cole URL da imagem" style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid var(--gray-light)', fontSize: '0.85rem', marginTop: '0.5rem' }} />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.5rem 1rem', borderRadius: 6, border: '1px solid var(--gray-light)', background: 'none', cursor: 'pointer' }}>Cancelar</button>
                  <button type="submit" disabled={savingPost} className="admin-save-btn">{savingPost ? 'Salvando...' : 'Salvar'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>celx CMS</h2>
        <ul className="admin-nav">
          <li><a href="#" onClick={e => { e.preventDefault(); setTab('sections') }} className={tab === 'sections' ? 'active' : ''}>Conteúdo</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); setTab('contacts') }} className={tab === 'contacts' ? 'active' : ''}>Mensagens {contacts.length > 0 && `(${contacts.length})`}</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); setTab('blog') }} className={tab === 'blog' ? 'active' : ''}>Blog</a></li>
        </ul>
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <a href="/" target="_blank" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>Ver site →</a>
          <button onClick={handleLogout} style={{ display: 'block', marginTop: '1rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', cursor: 'pointer', padding: 0 }}>Sair</button>
        </div>
      </aside>

      <main className="admin-content">
        {tab === 'sections' && (
          <>
            <h1>Editar Seções</h1>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              {SECTIONS.map(s => (
                <button
                  key={s.key}
                  onClick={() => handleSectionChange(s.key)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '100px',
                    border: '1px solid',
                    borderColor: activeSection === s.key ? 'var(--black)' : 'var(--gray-light)',
                    background: activeSection === s.key ? 'var(--black)' : 'var(--white)',
                    color: activeSection === s.key ? 'var(--white)' : 'var(--gray)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontFamily: 'var(--sans)',
                    transition: 'all 0.2s',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="admin-section-card">
              <h3>Seção: {SECTIONS.find(s => s.key === activeSection)?.label}</h3>
              {activeSection === 'hero' && (
                <div style={{ background: '#e8f4fd', border: '1px solid #b3d7fc', borderRadius: 8, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#1a5db3' }}>
                  <strong>📷 Upload de Foto de Capa (Hero):</strong><br />
                  <input
                    type="file"
                    accept="image/*"
                    id="cover-upload"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files[0]) {
                        const formData = new FormData()
                        formData.append('file', e.target.files[0])
                        formData.append('folder', 'blog')
                        setSavingLogo(true)
                        fetch('/api/v1/blog/admin/upload?folder=blog', {
                          method: 'POST',
                          headers: { Authorization: `Bearer ${localStorage.getItem('celx_token')}` },
                          body: formData
                        }).then(r => r.json()).then(data => {
                          const heroContent = sections.hero || {}
                          const updated = { ...heroContent, cover_url: data.url }
                          updateSection('hero', updated)
                          setSections(prev => ({ ...prev, hero: updated }))
                          setEditJson(JSON.stringify(updated, null, 2))
                          setSavingLogo(false)
                          setSaveMsg('✓ Foto de capa carregada! Lembre de clicar Salvar.')
                          setTimeout(() => setSaveMsg(''), 4000)
                        }).catch(() => { setSavingLogo(false) })
                      }
                    }}
                  />
                  <label htmlFor="cover-upload" style={{ background: '#1a5db3', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: 6, cursor: 'pointer', display: 'inline-block', fontSize: '0.8rem' }}>
                    {savingLogo ? 'Enviando...' : '🖼️ Carregar Foto de Capa'}
                  </label>
                  {sections.hero?.cover_url && <span style={{ marginLeft: '0.5rem' }}>✓ Capa definida</span>}
                  <br /><br />

                  <strong>👤 Upload da Sua Foto (Avatar):</strong><br />
                  <input
                    type="file"
                    accept="image/*"
                    id="avatar-upload"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files[0]) {
                        const formData = new FormData()
                        formData.append('file', e.target.files[0])
                        formData.append('folder', 'blog')
                        fetch('/api/v1/blog/admin/upload?folder=blog', {
                          method: 'POST',
                          headers: { Authorization: `Bearer ${localStorage.getItem('celx_token')}` },
                          body: formData
                        }).then(r => r.json()).then(data => {
                          const heroContent = sections.hero || {}
                          const updated = { ...heroContent, avatar_url: data.url }
                          updateSection('hero', updated)
                          setSections(prev => ({ ...prev, hero: updated }))
                          setEditJson(JSON.stringify(updated, null, 2))
                          setSaveMsg('✓ Sua foto carregada! Lembre de clicar Salvar.')
                          setTimeout(() => setSaveMsg(''), 4000)
                        })
                      }
                    }}
                  />
                  <label htmlFor="avatar-upload" style={{ background: '#0f6b1a', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: 6, cursor: 'pointer', display: 'inline-block', fontSize: '0.8rem' }}>
                    📸 Carregar Sua Foto
                  </label>
                  {sections.hero?.avatar_url && (
                    <span style={{ marginLeft: '0.5rem' }}>
                      ✓ Foto definida <img src={sections.hero.avatar_url} alt="avatar" style={{ height: 24, verticalAlign: 'middle', borderRadius: '50%', marginLeft: 4 }} />
                    </span>
                  )}
                  <br /><br />

                  <strong>🏷️ Upload de Logo (navbar):</strong><br />
                  <input
                    type="file"
                    accept="image/*"
                    id="logo-upload"
                    style={{ display: 'none' }}
                    onChange={e => {
                      if (e.target.files[0]) {
                        const formData = new FormData()
                        formData.append('file', e.target.files[0])
                        formData.append('folder', 'logos')
                        setSavingLogo(true)
                        fetch('/api/v1/blog/admin/upload?folder=logos', {
                          method: 'POST',
                          headers: { Authorization: `Bearer ${localStorage.getItem('celx_token')}` },
                          body: formData
                        }).then(r => r.json()).then(data => {
                          const heroContent = sections.hero || {}
                          const updated = { ...heroContent, logo_url: data.url }
                          updateSection('hero', updated)
                          setSections(prev => ({ ...prev, hero: updated }))
                          setEditJson(JSON.stringify(updated, null, 2))
                          setSavingLogo(false)
                          setSaveMsg('✓ Logo carregado e salvo!')
                          setTimeout(() => setSaveMsg(''), 3000)
                        }).catch(() => { setSavingLogo(false) })
                      }
                    }}
                  />
                  <label htmlFor="logo-upload" style={{ background: '#1a5db3', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: 6, cursor: 'pointer', display: 'inline-block', fontSize: '0.8rem' }}>
                    {savingLogo ? 'Enviando...' : '📤 Carregar Logo'}
                  </label>
                  {sections.hero?.logo_url && <span style={{ marginLeft: '0.5rem' }}>✓ Logo já definido</span>}
                </div>
              )}
              <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '1rem' }}>
                Edite o JSON abaixo. O preview não é renderizado — use com cuidado.
              </p>
              <textarea
                className="admin-textarea"
                value={editJson}
                onChange={e => { setEditJson(e.target.value); setSaveMsg('') }}
                style={{ fontFamily: 'monospace', fontSize: '0.8rem', background: '#1a1a2e', color: '#a8d8ea', minHeight: 400 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
                <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
                {saveMsg && (
                  <span style={{ fontSize: '0.85rem', color: saveMsg.startsWith('✓') ? 'green' : 'red' }}>
                    {saveMsg}
                  </span>
                )}
              </div>
            </div>
          </>
        )}

        {tab === 'contacts' && (
          <>
            <h1>Mensagens de Contato</h1>
            {contacts.length === 0 ? (
              <p style={{ color: 'var(--gray)' }}>Nenhuma mensagem ainda.</p>
            ) : (
              contacts.map(msg => (
                <div key={msg.id} className="admin-section-card">
                  <h3>{msg.name} <span style={{ fontSize: '0.8rem', color: 'var(--gray)', fontWeight: 300 }}>&lt;{msg.email}&gt;</span></h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '0.75rem' }}>
                    {new Date(msg.created_at).toLocaleString('pt-BR')}
                  </p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--black)', lineHeight: 1.7 }}>{msg.message}</p>
                </div>
              ))
            )}
          </>
        )}

        {tab === 'blog' && <BlogTab />}
      </main>
    </div>
  )
}
