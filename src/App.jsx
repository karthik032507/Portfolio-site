import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Journey from './components/Journey'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
