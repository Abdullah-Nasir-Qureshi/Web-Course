import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './Navbar'
import Home from './Home'
import About from './About'
import Contact from './Contact'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
