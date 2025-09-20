import React from 'react'
import { Link } from 'react-router-dom'
import { usePhotographers } from '../context/PhotographersContext.jsx'

function SearchBar() {
  const { search, setSearch } = usePhotographers()
  return (
    <div className="search">
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, city, or tag"
      />
    </div>
  )
}

function Filters() {
  const {
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
    reset
  } = usePhotographers()

  function toggleStyle(s) {
    setStyles(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]))
  }

  return (
    <aside className="filters">
      <div className="filter-group">
        <label>City</label>
        <select value={city} onChange={e => setCity(e.target.value)}>
          <option value="">All cities</option>
          {allCities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
        <input
          type="range"
          min="0"
          max="20000"
          step="500"
          value={priceRange[0]}
          onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
        />
        <input
          type="range"
          min="0"
          max="20000"
          step="500"
          value={priceRange[1]}
          onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
        />
      </div>

      <div className="filter-group">
        <label>Minimum Rating: {minRating}+</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={minRating}
          onChange={e => setMinRating(Number(e.target.value))}
        />
      </div>

      <div className="filter-group">
        <label>Styles</label>
        <div className="chips">
          {allStyles.map(s => (
            <button
              type="button"
              key={s}
              className={styles.includes(s) ? 'chip active' : 'chip'}
              onClick={() => toggleStyle(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="">Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="recent">Recently Added</option>
        </select>
      </div>

      <button className="btn secondary" onClick={reset}>Reset Filters</button>
    </aside>
  )
}

function Card({ p }) {
  return (
    <div className="card">
      <img src={p.profilePic || '/images/placeholder.svg'} alt={p.name} onError={(e)=>{e.currentTarget.src='/images/placeholder.svg'}} />
      <div className="card-body">
        <h3>{p.name}</h3>
        <div className="meta">
          <span>{p.location}</span>
          <span>₹{p.price}</span>
          <span>⭐ {p.rating}</span>
        </div>
        <div className="tags">
          {(p.tags || []).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <Link className="btn" to={`/photographer/${p.id}`}>View Profile</Link>
      </div>
    </div>
  )
}

export default function CategoryPage() {
  const { loading, error, visible, filtered, setVisibleCount } = usePhotographers()

  return (
    <main className="container grid">
      <div className="left">
        <SearchBar />
        <Filters />
      </div>

      <div className="right">
        <h2>Maternity Photographers in Bengaluru</h2>
        {loading && <div className="skeleton">Loading photographers…</div>}
        {error && <div className="error">Failed to load data.</div>}
        {!loading && !error && (
          <>
            <div className="grid-cards">
              {visible.map(p => <Card key={p.id} p={p} />)}
            </div>
            {visible.length < filtered.length && (
              <button className="btn load" onClick={() => setVisibleCount(c => c + 8)}>Load More</button>
            )}
            {filtered.length === 0 && <div className="empty">No photographers match your filters.</div>}
          </>
        )}
      </div>
    </main>
  )
}


