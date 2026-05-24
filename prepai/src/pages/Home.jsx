import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import HowItWorks from '../components/landing/HowItWorks'
import Pricing from '../components/landing/Pricing'
import FAQ from '../components/landing/FAQ'
import Contact from '../components/landing/Contact'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

const Home = () => {
  const location = useLocation()

  // Handle hash in URL on page load
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '')
      setTimeout(() => {
        const element = document.getElementById(id)
        if (element) {
          const navbarHeight = 80
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
        }
      }, 300)
    }
  }, [location])

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <Contact />
      <CTA />
      <Footer />
    </div>
  )
}

export default Home