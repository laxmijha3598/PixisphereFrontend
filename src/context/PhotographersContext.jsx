import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const PhotographersContext = createContext(null)

const API_URL = 'http://localhost:3001/photographers'

export function PhotographersProvider({ children }) {
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // filters
  const [search, setSearch] = useState('')
  const [priceRange, setPriceRange] = useState([0, 20000])
  const [minRating, setMinRating] = useState(0)
  const [styles, setStyles] = useState([]) // selected styles
  const [city, setCity] = useState('')
  const [sort, setSort] = useState('') // price-asc | rating-desc | recent
  const [visibleCount, setVisibleCount] = useState(8)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch(API_URL)
        const data = await res.json()
        if (!cancelled) setAll(Array.isArray(data) ? data : data.photographers || [])
      } catch (e) {
        if (!cancelled) setError(e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // debounced search value
  const [debouncedSearch, setDebouncedSearch] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300)
    return () => clearTimeout(id)
  }, [search])

  const allStyles = useMemo(() => {
    const set = new Set()
    all.forEach(p => p.styles?.forEach(s => set.add(s)))
    return Array.from(set)
  }, [all])

  const allCities = useMemo(() => {
    const set = new Set()
    all.forEach(p => p.location && set.add(p.location))
    return Array.from(set)
  }, [all])

  function fuzzyIncludes(text, query) {
    if (!query) return true
    const t = (text || '').toString().toLowerCase()
    // simple fuzzy: all query tokens must appear in order
    let i = 0
    for (const ch of query) {
      i = t.indexOf(ch, i)
      if (i === -1) return false
      i++
    }
    return true
  }

  const filtered = useMemo(() => {
    let result = all.filter(p => {
      const inPrice = p.price >= priceRange[0] && p.price <= priceRange[1]
      const inRating = (p.rating || 0) >= minRating
      const inCity = !city || p.location === city
      const inStyles = styles.length === 0 || styles.every(s => p.styles?.includes(s))
      const matchesSearch = !debouncedSearch || (
        fuzzyIncludes(p.name, debouncedSearch) ||
        fuzzyIncludes(p.location, debouncedSearch) ||
        (p.tags || []).some(t => fuzzyIncludes(t, debouncedSearch))
      )
      return inPrice && inRating && inCity && inStyles && matchesSearch
    })

    if (sort === 'price-asc') result.sort((a, b) => (a.price || 0) - (b.price || 0))
    if (sort === 'rating-desc') result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    if (sort === 'recent') result.sort((a, b) => (b.id || 0) - (a.id || 0))

    return result
  }, [all, priceRange, minRating, styles, city, debouncedSearch, sort])

  const visible = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount])

  const value = {
    loading,
    error,
    all,
    filtered,
    visible,
    setVisibleCount,
    search,
    setSearch,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    styles,
    setStyles,
    city,
    setCity,
    sort,
    setSort,
    allStyles,
    allCities,
    reset: () => {
      setSearch('')
      setPriceRange([0, 20000])
      setMinRating(0)
      setStyles([])
      setCity('')
      setSort('')
      setVisibleCount(8)
    }
  }

  return (
    <PhotographersContext.Provider value={value}>{children}</PhotographersContext.Provider>
  )
}

export function usePhotographers() {
  const ctx = useContext(PhotographersContext)
  if (!ctx) throw new Error('usePhotographers must be used within PhotographersProvider')
  return ctx
}


