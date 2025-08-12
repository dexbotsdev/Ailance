import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye, Clock, CheckCircle, XCircle, Loader, RotateCcw } from "lucide-react"
import Link from "next/link"
import { retryTask } from "@/lib/actions"

interface Task {
  id: string
  prompt: string
  status: "pending" | "processing" | "completed" | "failed"
  result?: string
  created_at: string
  updated_at: string
}

interface TaskHistoryProps {
  tasks: Task[]
}

function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />
    case "processing":
      return <Loader className="h-4 w-4 animate-spin" />
    case "completed":
      return <CheckCircle className="h-4 w-4" />
    case "failed":
      return <XCircle className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "completed":
      return "bg-green-100 text-green-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function TaskHistory({ tasks }: TaskHistoryProps) {
  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <Clock className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
          <p className="text-gray-600 text-center mb-6">
            Create your first AI task to get started with automated freelancing.
          </p>
          <Link href="/new-task">
            <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white">Create Your First Task</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Task History</h2>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-medium text-gray-900 mb-2">
                    {task.prompt.length > 100 ? `${task.prompt.substring(0, 100)}...` : task.prompt}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(task.status)} flex items-center space-x-1`}>
                    {getStatusIcon(task.status)}
                    <span className="capitalize">{task.status}</span>
                  </Badge>
                  {task.status === "completed" && (
                    <Link href={`/results/${task.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                    </Link>
                  )}
                  {task.status === "failed" && (
                    <form action={retryTask.bind(null, task.id)}>
                      <Button variant="outline" size="sm" type="submit">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retry
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </CardHeader>
            {task.result && task.status === "completed" && (
              <CardContent className="pt-0">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {task.result.length > 200 ? `${task.result.substring(0, 200)}...` : task.result}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
