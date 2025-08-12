import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function HomePage() {
  const supabase = createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3"></div>
              <h1 className="text-2xl font-bold text-white">AI Freelancer Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              🚀 Powered by Advanced AI Technology
            </span>
          </div>
          <h1 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl">
            AI-Powered Freelancing
            <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-300 leading-relaxed">
            Transform your workflow with intelligent AI assistance. Submit any task and receive professional-grade
            results in minutes, not hours. From content creation to data analysis, our AI handles it all.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold"
              >
                Start Free Trial - 5 Tasks Free
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg bg-transparent"
              >
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">No credit card required • Get started in 30 seconds</p>
        </div>

        {/* Features Grid */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose AI Freelancer Hub?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the future of task completion with our cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Lightning Fast Results</h3>
              <p className="text-gray-400 leading-relaxed">
                Get professional-quality work completed in minutes, not days. Our AI processes tasks instantly with
                remarkable speed and accuracy.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Premium Quality</h3>
              <p className="text-gray-400 leading-relaxed">
                Powered by state-of-the-art AI models that deliver consistent, professional-grade results every time.
                Quality you can trust.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-green-500/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Cost Effective</h3>
              <p className="text-gray-400 leading-relaxed">
                Save up to 90% compared to traditional freelancing. Get more done for less with transparent, affordable
                pricing.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-yellow-500/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">24/7 Availability</h3>
              <p className="text-gray-400 leading-relaxed">
                Never wait for business hours. Our AI works around the clock, ready to handle your tasks whenever
                inspiration strikes.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Scalable Solutions</h3>
              <p className="text-gray-400 leading-relaxed">
                From single tasks to bulk projects, our platform scales with your needs. Handle any workload with ease.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 hover:border-red-500/50 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure & Private</h3>
              <p className="text-gray-400 leading-relaxed">
                Your data is protected with enterprise-grade security. We never store or share your sensitive
                information.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Perfect for Every Task</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our AI excels at a wide range of professional tasks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Content Creation</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span> Blog posts and articles
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span> Social media content
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span> Marketing copy
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span> Product descriptions
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">Business Tasks</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span> Data analysis and reports
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span> Email templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span> Research summaries
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span> Presentation outlines
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Workflow?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are already saving time and money with AI-powered task completion.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold">
                Start Your Free Trial Today
              </Button>
            </Link>
            <p className="mt-4 text-sm text-blue-200">5 free tasks • No credit card required • Cancel anytime</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mr-3"></div>
              <h3 className="text-xl font-bold text-white">AI Freelancer Hub</h3>
            </div>
            <p className="text-gray-400 mb-6">Empowering professionals with AI-driven task solutions</p>
            <div className="flex justify-center space-x-6">
              <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="text-gray-400 hover:text-white transition-colors">
                Get Started
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-500 text-sm">© 2024 AI Freelancer Hub. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
