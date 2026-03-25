import { useState } from 'react'
import './Contact.css'

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const newErrors = {}
    if (!form.name) newErrors.name = 'Name is required.'
    if (!form.email) newErrors.email = 'Email is required.'
    if (!form.message) newErrors.message = 'Message is required.'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log(form)
    setErrors({})
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="contact-wrapper">
      <h1>Contact Us</h1>
      <br></br>
      <p className="contact-subtitle">Fill out the form below and we'll get back to you.</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <span role="alert" className="error-msg">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span role="alert" className="error-msg">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Write your message..."
            rows={5}
            value={form.message}
            onChange={handleChange}
            className={errors.message ? 'input-error' : ''}
          />
          {errors.message && <span role="alert" className="error-msg">{errors.message}</span>}
        </div>

        <button type="submit" className="submit-btn">Send Message</button>
      </form>
    </div>
  )
}

export default Contact
