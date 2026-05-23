import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { ArrowRight, FileText } from 'lucide-react'

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 rounded-full px-4 py-1.5 mb-6">
          <span className="text-blue-400 text-sm font-medium">
            🎯 Placement Season 2024-25
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Practice interviews before your placement rounds.
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          AI-powered mock interviews, resume analysis, and coding practice — 
          everything you need to crack your dream placement.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link to="/register">
            <Button size="lg" className="gap-2">
              Start Practice
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Analyze Resume
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
          {[
            { value: "10K+", label: "Students Placed" },
            { value: "500+", label: "Companies" },
            { value: "95%", label: "Success Rate" },
            { value: "50K+", label: "Interviews Conducted" },
          ].map((stat, idx) => (
            <div key={idx}>
              <div className="text-2xl md:text-3xl font-bold text-blue-500">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero