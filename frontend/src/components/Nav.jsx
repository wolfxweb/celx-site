import { usePageContent } from '../hooks/usePageContent'

export default function Nav() {
  const { data } = usePageContent()

  const links = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/#sobre' },
    { label: 'Portfólio', href: '/#portfolio' },
    { label: 'Serviços', href: '/#servicos' },
  ]

  const logoUrl = data?.hero?.logo_url

  return (
    <nav>
      {logoUrl ? (
        <a href="/" className="nav-logo">
          <img src={logoUrl} alt="Logo" style={{ height: 32, objectFit: 'contain' }} />
        </a>
      ) : (
        <a href="/" className="nav-logo">Carlos Eduardo Lobo</a>
      )}
      <ul className="nav-links">
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <a href="/#contato" className="nav-cta">Contratar</a>
    </nav>
  )
}
