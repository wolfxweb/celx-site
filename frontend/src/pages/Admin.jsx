import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/usePageContent'

const SECTIONS = [
  { key: 'hero', label: 'Hero' },
  { key: 'stats', label: 'Stats' },
  { key: 'sobre', label: 'Sobre' },
  { key: 'especialidades', label: 'Especialidades' },
  { key: 'portfolio', label: 'Portfólio' },
  { key: 'artigos', label: 'Artigos' },
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
  const [tab, setTab] = useState('sections') // 'sections' | 'contacts'

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

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>celx CMS</h2>
        <ul className="admin-nav">
          <li><a href="#" onClick={e => { e.preventDefault(); setTab('sections') }} className={tab === 'sections' ? 'active' : ''}>Conteúdo</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); setTab('contacts') }} className={tab === 'contacts' ? 'active' : ''}>Mensagens {contacts.length > 0 && `(${contacts.length})`}</a></li>
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
      </main>
    </div>
  )
}
