import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import TaskHistory from "@/components/task-history"
import { getUserProfile, getUserTasks, getArchivedTasks } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Archive, List } from "lucide-react"
import Link from "next/link"

interface DashboardPageProps {
  searchParams: { view?: string }
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile and tasks
  const userProfile = await getUserProfile(user.id)
  const showArchived = searchParams.view === "archived"
  const tasks = showArchived ? await getArchivedTasks(user.id) : await getUserTasks(user.id)
  const allTasks = await getUserTasks(user.id)

  // If user profile doesn't exist, create it
  if (!userProfile) {
    const { error } = await supabase.from("users").insert({
      id: user.id,
      email: user.email || "",
      credits: 5,
    })

    if (error) {
      console.error("Error creating user profile:", error)
    }
  }

  const credits = userProfile?.credits || 5
  const userEmail = user.email || ""

  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardHeader userEmail={userEmail} credits={credits} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-gray-400">
            You have <span className="font-semibold text-blue-400">{credits} credits</span> remaining. Each task costs 1
            credit.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="bg-blue-600 p-3 rounded-full">
                <span className="text-white text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-white">{allTasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="bg-green-600 p-3 rounded-full">
                <span className="text-white text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-white">
                  {allTasks.filter((task) => task.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="bg-yellow-600 p-3 rounded-full">
                <span className="text-white text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-white">
                  {allTasks.filter((task) => task.status === "processing" || task.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-center">
              <div className="bg-blue-600 p-3 rounded-full">
                <span className="text-white text-xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Credits Left</p>
                <p className="text-2xl font-bold text-white">{credits}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Button
                variant={!showArchived ? "default" : "outline"}
                size="sm"
                className={
                  !showArchived
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                }
              >
                <List className="h-4 w-4 mr-2" />
                Active Tasks
              </Button>
            </Link>
            <Link href="/dashboard?view=archived">
              <Button
                variant={showArchived ? "default" : "outline"}
                size="sm"
                className={
                  showArchived
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                }
              >
                <Archive className="h-4 w-4 mr-2" />
                Archived Tasks
              </Button>
            </Link>
          </div>
        </div>

        {/* Task History */}
        <TaskHistory tasks={tasks} showArchived={showArchived} />
      </main>
    </div>
  )
}
