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

    const result = streamText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: task.prompt,
      system: `You are a professional AI freelancer assistant. The user has submitted the following task: "${task.prompt}". 
      
      Provide a comprehensive, professional response that directly addresses their request. Be thorough, accurate, and helpful. 
      Format your response clearly with proper structure when appropriate.`,
    })

    let fullResponse = ""

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            fullResponse += chunk
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ chunk, fullResponse })}\n\n`))
          }

          // Save final result to database
          await supabase
            .from("tasks")
            .update({
              status: "completed",
              result: fullResponse,
              updated_at: new Date().toISOString(),
            })
            .eq("id", taskId)

          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`))
          controller.close()
        } catch (error) {
          console.error("Streaming error:", error)

          await supabase
            .from("tasks")
            .update({
              status: "failed",
              result: "Failed to process task. Please try again.",
              updated_at: new Date().toISOString(),
            })
            .eq("id", taskId)

          controller.enqueue(
            new TextEncoder().encode(`data: ${JSON.stringify({ error: "Failed to process task" })}\n\n`),
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Error processing task:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
