import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "5 tasks included",
      description: "Perfect for trying out our AI services",
      features: ["5 free AI tasks", "Basic task types", "Email support", "Standard processing speed"],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Starter",
      price: "$9.99",
      period: "per month",
      description: "Great for individuals and small projects",
      features: [
        "50 AI tasks per month",
        "All task types",
        "Priority email support",
        "Fast processing speed",
        "Task history & export",
      ],
      buttonText: "Choose Starter",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      name: "Professional",
      price: "$29.99",
      period: "per month",
      description: "Perfect for businesses and heavy users",
      features: [
        "200 AI tasks per month",
        "All task types",
        "Priority support",
        "Fastest processing speed",
        "Advanced task management",
        "API access",
        "Custom integrations",
      ],
      buttonText: "Choose Professional",
      buttonVariant: "default" as const,
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-6">Pricing Plans</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All plans include access to our powerful AI tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-[#007BFF] border-2 shadow-lg" : "border-gray-200"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#007BFF] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full py-3 text-lg ${
                    plan.buttonVariant === "default"
                      ? "bg-[#007BFF] hover:bg-[#0056b3] text-white"
                      : "border-[#007BFF] text-[#007BFF] hover:bg-[#007BFF] hover:text-white bg-transparent"
                  }`}
                  variant={plan.buttonVariant}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">What counts as a task?</h3>
                <p className="text-gray-700">
                  Each prompt you submit to our AI counts as one task. This includes writing, editing, analysis, or any
                  other AI-powered work you request.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-700">
                  Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate any
                  billing differences.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">What happens if I exceed my monthly limit?</h3>
                <p className="text-gray-700">
                  If you reach your monthly task limit, you can either upgrade your plan or wait until the next billing
                  cycle. We'll notify you when you're approaching your limit.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
