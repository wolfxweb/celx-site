import { useState, useEffect } from 'react'

export function usePageContent() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/v1/pages/home')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load page content')
        return r.json()
      })
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }, [])

  return { data, loading, error }
}

export function useAdminAuth() {
  const token = localStorage.getItem('celx_token')

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  async function fetchSections() {
    const r = await fetch('/api/v1/admin/sections', { headers })
    if (!r.ok) throw new Error('Unauthorized')
    return r.json()
  }

  async function updateSection(section, content) {
    const r = await fetch(`/api/v1/admin/sections/${section}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ content }),
    })
    if (!r.ok) throw new Error('Failed to update section')
    return r.json()
  }

  async function fetchContacts() {
    const r = await fetch('/api/v1/admin/contacts', { headers })
    if (!r.ok) throw new Error('Unauthorized')
    return r.json()
  }

  return { fetchSections, updateSection, fetchContacts }
}
