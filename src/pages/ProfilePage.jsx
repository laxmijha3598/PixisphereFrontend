import React, { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePhotographers } from '../context/PhotographersContext.jsx'

export default function ProfilePage() {
  const { id } = useParams()
  const { all, loading } = usePhotographers()
  const p = useMemo(() => all.find(x => String(x.id) === String(id)), [all, id])
  const [open, setOpen] = useState(false)

  if (loading) return <main className="container"><div className="skeleton">Loading…</div></main>
  if (!p) return <main className="container"><div className="error">Profile not found. <Link to="/">Go back</Link></div></main>

  return (
    <main className="container profile">
      <Link to="/" className="back">← Back to list</Link>
      <div className="hero">
        <img src={p.profilePic || '/images/placeholder.svg'} alt={p.name} onError={(e)=>{e.currentTarget.src='/images/placeholder.svg'}} />
        <div>
          <h1>{p.name}</h1>
          <div className="meta">
            <span>{p.location}</span>
            <span>₹{p.price}</span>
            <span>⭐ {p.rating}</span>
          </div>
          <p>{p.bio}</p>
          <div className="tags">
            {(p.styles || []).map(s => <span key={s} className="tag">{s}</span>)}
            {(p.tags || []).map(t => <span key={t} className="tag alt">{t}</span>)}
          </div>
          <button className="btn" onClick={() => setOpen(true)}>Send Inquiry</button>
        </div>
      </div>

      <section>
        <h2>Gallery</h2>
        <div className="gallery">
          {(p.portfolio || []).map((src, i) => (
            <img key={i} src={src || '/images/placeholder.svg'} alt={`work-${i}`} onError={(e)=>{e.currentTarget.src='/images/placeholder.svg'}} />
          ))}
        </div>
      </section>

      <section>
        <h2>Reviews</h2>
        <div className="reviews">
          {(p.reviews || []).map((r, i) => (
            <div className="review" key={i}>
              <div className="review-head">
                <strong>{r.name}</strong>
                <span>⭐ {r.rating}</span>
                <span>{r.date}</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {open && (
        <div className="modal" onClick={() => setOpen(false)}>
          <div className="modal-body" onClick={e => e.stopPropagation()}>
            <h3>Send Inquiry</h3>
            <InquiryForm photographer={p} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </main>
  )
}

function InquiryForm({ photographer, onClose }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  function submit(e) {
    e.preventDefault()
    setSent(true)
    setTimeout(onClose, 1000)
  }

  if (sent) return <div className="success">Inquiry sent! {photographer.name} will get back soon.</div>

  return (
    <form onSubmit={submit} className="form">
      <label>
        Name
        <input value={name} onChange={e => setName(e.target.value)} required />
      </label>
      <label>
        Email
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      </label>
      <label>
        Message
        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} />
      </label>
      <button className="btn" type="submit">Send</button>
    </form>
  )
}


