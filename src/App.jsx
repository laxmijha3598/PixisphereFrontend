import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import CategoryPage from './pages/CategoryPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import { PhotographersProvider } from './context/PhotographersContext.jsx'

function Header() {
  const location = useLocation()
  return (
    <header className="container">
      <div className="nav">
        <Link className="logo" to="/">Pixisphere</Link>
        <nav className="breadcrumbs">{location.pathname}</nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <PhotographersProvider>
      <Header />
      <Routes>
        <Route path="/" element={<CategoryPage />} />
        <Route path="/photographer/:id" element={<ProfilePage />} />
      </Routes>
      <footer className="container footer">© {new Date().getFullYear()} Pixisphere</footer>
    </PhotographersProvider>
  )
}


