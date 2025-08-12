import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import TaskHistory from "@/components/task-history"
import { getUserProfile, getUserTasks } from "@/lib/database"

export default async function DashboardPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile and tasks
  const userProfile = await getUserProfile(user.id)
  const tasks = await getUserTasks(user.id)

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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader userEmail={userEmail} credits={credits} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">
            You have <span className="font-semibold text-[#007BFF]">{credits} credits</span> remaining. Each task costs
            1 credit.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-[#007BFF] p-3 rounded-full">
                <span className="text-white text-xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-full">
                <span className="text-white text-xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter((task) => task.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-yellow-500 p-3 rounded-full">
                <span className="text-white text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter((task) => task.status === "processing" || task.status === "pending").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="bg-[#007BFF] p-3 rounded-full">
                <span className="text-white text-xl">💳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Credits Left</p>
                <p className="text-2xl font-bold text-gray-900">{credits}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task History */}
        <TaskHistory tasks={tasks} />
      </main>
    </div>
  )
}
