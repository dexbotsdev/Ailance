"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react"

interface StreamData {
  chunk?: string
  fullResponse?: string
  done?: boolean
  error?: string
}

export default function TaskStreamPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const [streamedContent, setStreamedContent] = useState("")
  const [isStreaming, setIsStreaming] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!taskId) return

    const startStreaming = async () => {
      try {
        const response = await fetch("/api/stream-task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskId }),
        })

        if (!response.ok) {
          throw new Error("Failed to start streaming")
        }

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (!reader) {
          throw new Error("No reader available")
        }

        while (true) {
          const { done, value } = await reader.read()

          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data: StreamData = JSON.parse(line.slice(6))

                if (data.error) {
                  setError(data.error)
                  setIsStreaming(false)
                  return
                }

                if (data.chunk) {
                  setStreamedContent((prev) => prev + data.chunk)
                }

                if (data.done) {
                  setIsComplete(true)
                  setIsStreaming(false)
                  return
                }
              } catch (parseError) {
                console.error("Error parsing stream data:", parseError)
              }
            }
          }
        }
      } catch (err) {
        console.error("Streaming error:", err)
        setError("Failed to stream task progress")
        setIsStreaming(false)
      }
    }

    startStreaming()
  }, [taskId])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              {isStreaming && <Loader2 className="w-5 h-5 animate-spin text-blue-400" />}
              {isComplete && <CheckCircle className="w-5 h-5 text-green-400" />}
              {error && <XCircle className="w-5 h-5 text-red-400" />}

              {isStreaming && "AI is generating your response..."}
              {isComplete && "Task completed successfully!"}
              {error && "Task failed"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-800">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700">
                  Retry
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-600">
                  <h3 className="text-sm font-medium text-gray-300 mb-2">AI Response:</h3>
                  <div className="text-gray-100 whitespace-pre-wrap leading-relaxed">
                    {streamedContent}
                    {isStreaming && <span className="inline-block w-2 h-5 bg-blue-400 animate-pulse ml-1" />}
                  </div>
                </div>

                {isComplete && (
                  <div className="flex gap-2">
                    <Button onClick={() => router.push(`/results/${taskId}`)} className="bg-blue-600 hover:bg-blue-700">
                      View Full Results
                    </Button>
                    <Button
                      onClick={() => router.push("/dashboard")}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
