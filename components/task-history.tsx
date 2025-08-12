import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  RotateCcw,
  Archive,
  ArchiveRestore,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { retryTask, archiveTask, unarchiveTask } from "@/lib/actions"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Task {
  id: string
  prompt: string
  status: "pending" | "processing" | "completed" | "failed"
  result?: string
  created_at: string
  updated_at: string
  archived?: boolean
}

interface TaskHistoryProps {
  tasks: Task[]
  showArchived?: boolean
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

export default function TaskHistory({ tasks, showArchived = false }: TaskHistoryProps) {
  if (tasks.length === 0) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-gray-400 mb-4">
            <Clock className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">{showArchived ? "No archived tasks" : "No tasks yet"}</h3>
          <p className="text-gray-400 text-center mb-6">
            {showArchived
              ? "You haven't archived any tasks yet."
              : "Create your first AI task to get started with automated freelancing."}
          </p>
          {!showArchived && (
            <Link href="/new-task">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create Your First Task</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">{showArchived ? "Archived Tasks" : "Task History"}</h2>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-medium text-white mb-2">
                    {task.prompt.length > 100 ? `${task.prompt.substring(0, 100)}...` : task.prompt}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                    <span>Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={`${getStatusColor(task.status)} flex items-center space-x-1`}>
                    {getStatusIcon(task.status)}
                    <span className="capitalize">{task.status}</span>
                  </Badge>

                  <div className="flex items-center space-x-2">
                    {task.status === "completed" && (
                      <Link href={`/results/${task.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    )}
                    {task.status === "failed" && (
                      <form action={retryTask.bind(null, task.id)}>
                        <Button
                          variant="outline"
                          size="sm"
                          type="submit"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Retry
                        </Button>
                      </form>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem asChild>
                          <Link href={`/results/${task.id}`} className="text-gray-300 hover:text-white">
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Details
                          </Link>
                        </DropdownMenuItem>
                        {!task.archived ? (
                          <DropdownMenuItem asChild>
                            <form action={archiveTask.bind(null, task.id)}>
                              <button type="submit" className="flex items-center w-full text-gray-300 hover:text-white">
                                <Archive className="h-4 w-4 mr-2" />
                                Archive Task
                              </button>
                            </form>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem asChild>
                            <form action={unarchiveTask.bind(null, task.id)}>
                              <button type="submit" className="flex items-center w-full text-gray-300 hover:text-white">
                                <ArchiveRestore className="h-4 w-4 mr-2" />
                                Unarchive Task
                              </button>
                            </form>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardHeader>
            {task.result && task.status === "completed" && (
              <CardContent className="pt-0">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300 line-clamp-3">
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
