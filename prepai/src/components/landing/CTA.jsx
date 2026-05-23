import { Link } from 'react-router-dom'

const CTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to ace your placement interviews?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of students who successfully cracked their dream jobs with PrepAI
          </p>
          <Link to="/register">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Free Practice
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CTA