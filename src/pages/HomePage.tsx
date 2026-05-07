import { useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import About from '../components/About/About'
import Projects from '../components/Projects/Projects'
import Calculator from '../components/Calculator/Calculator'
import Stack from '../components/Stack/Stack'
import Chat from '../components/Chat/Chat'
import Quiz from '../components/Quiz/Quiz'
import OrderModal, { type OrderConfig } from '../components/OrderModal/OrderModal'
import SimilarModal from '../components/SimilarModal/SimilarModal'

export default function HomePage() {
  const [quizOpen, setQuizOpen]       = useState(false)
  const [orderOpen, setOrderOpen]     = useState(false)
  const [orderConfig, setOrderConfig] = useState<OrderConfig | undefined>()
  const [similarOpen, setSimilarOpen] = useState(false)
  const [similarTitle, setSimilarTitle] = useState('')

  const openOrder = (config: OrderConfig) => {
    setOrderConfig(config)
    setOrderOpen(true)
  }

  const openSimilar = (projectTitle: string) => {
    setSimilarTitle(projectTitle)
    setSimilarOpen(true)
  }

  return (
    <>
      <Navbar onQuizOpen={() => setQuizOpen(true)} />

      <main style={{ paddingTop: 60 }}>
        <Hero       onQuizOpen={() => setQuizOpen(true)} onSimilarOpen={openSimilar} />
        <About />
        <Projects   onSimilarOpen={openSimilar} />
        <Calculator onOrderOpen={openOrder} />
        <Stack />
        <Chat />
      </main>

      <footer
        style={{
          borderTop: '1px solid #e7e3d8',
          padding: '24px',
          textAlign: 'center',
          fontSize: 13,
          color: '#78716c',
          background: '#ffffff',
          fontWeight: 500,
        }}
      >
        © {new Date().getFullYear()} Алексей, FullStack разработчик
      </footer>

      <Quiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
      <OrderModal
        isOpen={orderOpen}
        onClose={() => setOrderOpen(false)}
        config={orderConfig}
      />
      <SimilarModal
        isOpen={similarOpen}
        onClose={() => setSimilarOpen(false)}
        projectTitle={similarTitle}
      />
    </>
  )
}
