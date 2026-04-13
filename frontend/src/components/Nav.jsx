export default function Nav({ sections = [] }) {
  const links = [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Portfólio', href: '#portfolio' },
    { label: 'Conteúdo', href: '#conteudo' },
    { label: 'Serviços', href: '#servicos' },
  ]

  return (
    <nav>
      <a href="#" className="nav-logo">Carlos Eduardo Lobo</a>
      <ul className="nav-links">
        {links.map(l => (
          <li key={l.href}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>
      <a href="#contato" className="nav-cta">Contratar</a>
    </nav>
  )
}
