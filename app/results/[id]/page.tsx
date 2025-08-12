import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTaskById } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Download, Archive, ArchiveRestore } from "lucide-react"
import Link from "next/link"
import { archiveTask, unarchiveTask } from "@/lib/actions"

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
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-white ml-6">Task Details</h1>
            </div>
            <div className="flex items-center space-x-2">
              {!task.archived ? (
                <form action={archiveTask.bind(null, task.id)}>
                  <Button
                    variant="outline"
                    size="sm"
                    type="submit"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Task
                  </Button>
                </form>
              ) : (
                <form action={unarchiveTask.bind(null, task.id)}>
                  <Button
                    variant="outline"
                    size="sm"
                    type="submit"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                  >
                    <ArchiveRestore className="h-4 w-4 mr-2" />
                    Unarchive Task
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl text-white">Task Details</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={`${
                      task.status === "completed"
                        ? "bg-green-900 text-green-300 border-green-700"
                        : task.status === "failed"
                          ? "bg-red-900 text-red-300 border-red-700"
                          : "bg-yellow-900 text-yellow-300 border-yellow-700"
                    }`}
                  >
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Badge>
                  {task.archived && <Badge className="bg-gray-700 text-gray-300 border-gray-600">Archived</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-white mb-2">Original Prompt</h3>
                  <p className="text-gray-300 bg-gray-900 p-4 rounded-lg border border-gray-700">{task.prompt}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-400">Created:</span>
                    <span className="ml-2 text-gray-300">{new Date(task.created_at).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-400">Updated:</span>
                    <span className="ml-2 text-gray-300">{new Date(task.updated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {task.status === "completed" && task.result && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-white">AI Generated Result</CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                  <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed">
                    {task.result}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {task.status === "failed" && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-red-400">Task Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  This task failed to complete. Please try creating a new task with a different prompt.
                </p>
                <Link href="/new-task" className="inline-block mt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create New Task</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {(task.status === "pending" || task.status === "processing") && (
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-white">Task In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Your task is currently being processed by our AI. This usually takes a few minutes.
                </p>
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-400">Processing...</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
