import { useCallback, useState } from 'react'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Journey from './components/Journey'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])

  return (
    <>
      {!ready && <Preloader onDone={onLoaded} />}
      <Nav />
      <main>
        <Hero ready={ready} />
        <About />
        <Journey />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
