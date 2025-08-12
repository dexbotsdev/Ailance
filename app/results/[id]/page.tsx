import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTaskById } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download } from "lucide-react"
import Link from "next/link"

interface ResultsPageProps {
  params: {
    id: string
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const task = await getTaskById(params.id, user.id)

  if (!task) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 ml-6">Task Results</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Task Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl">Task Details</CardTitle>
                <Badge
                  className={`${
                    task.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : task.status === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Original Prompt</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{task.prompt}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Created:</span>
                    <span className="ml-2 text-gray-900">{new Date(task.created_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Updated:</span>
                    <span className="ml-2 text-gray-900">{new Date(task.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {task.status === "completed" && task.result && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">AI Generated Result</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-gray-900 font-mono text-sm leading-relaxed">
                    {task.result}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {task.status === "failed" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-red-600">Task Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  This task failed to complete. Please try creating a new task with a different prompt.
                </p>
                <Link href="/new-task" className="inline-block mt-4">
                  <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white">Create New Task</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {(task.status === "pending" || task.status === "processing") && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Task In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Your task is currently being processed by our AI. This usually takes a few minutes.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#007BFF]"></div>
                  <span className="text-sm text-gray-600">Processing...</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
