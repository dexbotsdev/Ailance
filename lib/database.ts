import { createClient } from "@/lib/supabase/server"

export async function getUserProfile(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export async function getUserTasks(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("archived", false)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user tasks:", error)
    return []
  }

  return data || []
}

export async function getArchivedTasks(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .eq("archived", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching archived tasks:", error)
    return []
  }

  return data || []
}

export async function getTaskById(taskId: string, userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("tasks").select("*").eq("id", taskId).eq("user_id", userId).single()

  if (error) {
    console.error("Error fetching task:", error)
    return null
  }

  return data
}

export async function createTask(userId: string, prompt: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      prompt,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating task:", error)
    return null
  }

  return data
}

export async function updateUserCredits(userId: string, credits: number) {
  const supabase = createClient()

  const { error } = await supabase.from("users").update({ credits }).eq("id", userId)

  if (error) {
    console.error("Error updating user credits:", error)
    return false
  }

  return true
}
