import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { taskId } = await request.json()

    if (!taskId) {
      return new Response("Task ID is required", { status: 400 })
    }

    const supabase = createClient()

    // Get task details
    const { data: task, error: taskError } = await supabase.from("tasks").select("*").eq("id", taskId).single()

    if (taskError || !task) {
      return new Response("Task not found", { status: 404 })
    }

    // Update task status to processing
    await supabase
      .from("tasks")
      .update({
        status: "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId)

    // Process with Grok AI
    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: task.prompt,
      system: `You are a professional AI freelancer assistant. The user has submitted the following task: "${task.prompt}". 
      
      Provide a comprehensive, professional response that directly addresses their request. Be thorough, accurate, and helpful. 
      Format your response clearly with proper structure when appropriate.`,
    })

    // Convert stream to text and save result
    let fullResponse = ""
    const reader = result.textStream.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        fullResponse += decoder.decode(value, { stream: true })
      }

      // Update task with result
      await supabase
        .from("tasks")
        .update({
          status: "completed",
          result: fullResponse,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)

      return new Response(
        JSON.stringify({
          success: true,
          result: fullResponse,
        }),
        {
          headers: { "Content-Type": "application/json" },
        },
      )
    } catch (streamError) {
      console.error("Error processing stream:", streamError)

      // Update task status to failed
      await supabase
        .from("tasks")
        .update({
          status: "failed",
          result: "Failed to process task. Please try again.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId)

      return new Response("Failed to process task", { status: 500 })
    }
  } catch (error) {
    console.error("Error processing task:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
