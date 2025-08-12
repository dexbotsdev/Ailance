"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserProfile, createTask, updateUserCredits } from "@/lib/database"

export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const supabase = createClient()

  try {
    const { error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}

export async function createNewTask(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const prompt = formData.get("prompt")

  if (!prompt || typeof prompt !== "string") {
    return { error: "Task description is required" }
  }

  if (prompt.length < 20) {
    return { error: "Task description must be at least 20 characters long" }
  }

  if (prompt.length > 2000) {
    return { error: "Task description must be less than 2000 characters" }
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a task" }
  }

  try {
    // Check user credits
    const userProfile = await getUserProfile(user.id)
    if (!userProfile || userProfile.credits < 1) {
      return { error: "Insufficient credits. You need at least 1 credit to create a task." }
    }

    // Create the task
    const task = await createTask(user.id, prompt.trim())
    if (!task) {
      return { error: "Failed to create task. Please try again." }
    }

    // Deduct 1 credit
    const success = await updateUserCredits(user.id, userProfile.credits - 1)
    if (!success) {
      return { error: "Failed to update credits. Please contact support." }
    }

    fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/process-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId: task.id }),
    }).catch((error) => {
      console.error("Failed to trigger AI processing:", error)
    })

    return { success: "Task created successfully! Redirecting to dashboard..." }
  } catch (error) {
    console.error("Create task error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function retryTask(taskId: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to retry a task" }
  }

  try {
    // Update task status to pending
    await supabase
      .from("tasks")
      .update({
        status: "pending",
        result: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .eq("user_id", user.id)

    // Trigger AI processing
    fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/process-task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ taskId }),
    }).catch((error) => {
      console.error("Failed to trigger AI processing:", error)
    })

    return { success: true }
  } catch (error) {
    console.error("Retry task error:", error)
    return { error: "Failed to retry task. Please try again." }
  }
}

export async function archiveTask(taskId: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    const { error } = await supabase
      .from("tasks")
      .update({
        archived: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error archiving task:", error)
      return { error: "Failed to archive task. Please try again." }
    }

    redirect("/dashboard")
  } catch (error) {
    console.error("Archive task error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function unarchiveTask(taskId: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    const { error } = await supabase
      .from("tasks")
      .update({
        archived: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)
      .eq("user_id", user.id)

    if (error) {
      console.error("Error unarchiving task:", error)
      return { error: "Failed to unarchive task. Please try again." }
    }

    redirect("/dashboard")
  } catch (error) {
    console.error("Unarchive task error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}
