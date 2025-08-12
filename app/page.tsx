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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">AI Freelancer Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-[#007BFF] text-[#007BFF] hover:bg-[#007BFF] hover:text-white bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            AI-Powered Freelancing
            <span className="block text-[#007BFF]">Made Simple</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Submit your tasks and let our AI handle the work. Get professional results in minutes, not hours.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-[#007BFF] hover:bg-[#0056b3] text-white px-8 py-3 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-[#007BFF] text-[#007BFF] hover:bg-[#007BFF] hover:text-white px-8 py-3 text-lg bg-transparent"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-[#007BFF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Get your tasks completed in minutes with our advanced AI technology.</p>
          </div>
          <div className="text-center">
            <div className="bg-[#007BFF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">High Quality</h3>
            <p className="text-gray-600">Professional-grade results powered by cutting-edge AI models.</p>
          </div>
          <div className="text-center">
            <div className="bg-[#007BFF] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cost Effective</h3>
            <p className="text-gray-600">Save time and money with our affordable AI-powered solutions.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
