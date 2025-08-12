"use client"

import { useActionState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Lightbulb, Zap } from "lucide-react"
import { createNewTask } from "@/lib/actions"

function SubmitButton({ credits }: { credits: number }) {
  const { pending } = useFormStatus()
  const hasCredits = credits > 0

  return (
    <Button
      type="submit"
      disabled={pending || !hasCredits}
      className="w-full bg-[#007BFF] hover:bg-[#0056b3] text-white py-3 text-lg font-medium rounded-lg disabled:opacity-50"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Task...
        </>
      ) : !hasCredits ? (
        "Insufficient Credits"
      ) : (
        <>
          <Zap className="mr-2 h-4 w-4" />
          Create Task (1 Credit)
        </>
      )}
    </Button>
  )
}

interface NewTaskFormProps {
  credits: number
}

export default function NewTaskForm({ credits }: NewTaskFormProps) {
  const [state, formAction] = useActionState(createNewTask, null)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      // Show success message briefly then redirect
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    }
  }, [state?.success, router])

  const examplePrompts = [
    "Write a professional email to follow up on a job application",
    "Create a social media content calendar for a fitness brand",
    "Draft a business proposal for a web development project",
    "Write product descriptions for an e-commerce store",
    "Create a marketing strategy for a new mobile app",
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Credits Warning */}
      {credits === 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
              </div>
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">No Credits Remaining</h3>
                <p className="text-red-700 dark:text-red-300">
                  You need at least 1 credit to create a new task. Please upgrade your plan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-white">Create New AI Task</CardTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Describe what you need help with. Be specific and detailed for the best results.
          </p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            {state?.success && (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
                {state.success}
              </div>
            )}

            {state?.error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Task Description *
              </label>
              <Textarea
                id="prompt"
                name="prompt"
                placeholder="Describe your task in detail. For example: 'Write a professional email to follow up on a job application for a software developer position. Include my enthusiasm for the role and ask about next steps.'"
                required
                rows={6}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Minimum 20 characters. Be specific about what you want the AI to create or help you with.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Cost:</span>
                <span className="text-lg font-bold text-[#007BFF]">1 Credit</span>
                <span className="text-gray-500 dark:text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-300">You have {credits} credits remaining</span>
              </div>
            </div>

            <SubmitButton credits={credits} />
          </form>
        </CardContent>
      </Card>

      {/* Example Prompts */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-[#007BFF]" />
            Example Prompts
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300">Get inspired by these example tasks</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {examplePrompts.map((prompt, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#007BFF] hover:bg-blue-50 dark:hover:bg-blue-950 cursor-pointer transition-colors"
                onClick={() => {
                  const textarea = document.getElementById("prompt") as HTMLTextAreaElement
                  if (textarea) {
                    textarea.value = prompt
                    textarea.focus()
                  }
                }}
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">{prompt}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900 dark:text-white">Tips for Better Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start space-x-2">
              <span className="text-[#007BFF] font-bold">•</span>
              <span>Be specific about the format, tone, and style you want</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#007BFF] font-bold">•</span>
              <span>Include relevant context and background information</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#007BFF] font-bold">•</span>
              <span>Mention your target audience if applicable</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-[#007BFF] font-bold">•</span>
              <span>Specify any requirements like word count or key points to include</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
