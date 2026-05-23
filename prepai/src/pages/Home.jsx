import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import Features from '../components/landing/Features'
import CTA from '../components/landing/CTA'
import Footer from '../components/landing/Footer'

const Home = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}

export default Home