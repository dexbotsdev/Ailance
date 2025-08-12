"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Plus, User } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"

interface DashboardHeaderProps {
  userEmail: string
  credits: number
}

export default function DashboardHeader({ userEmail, credits }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold text-gray-900">AI Freelancer Hub</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {/* Credits Display */}
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Credits:</span>
              <span className="text-lg font-bold text-[#007BFF]">{credits}</span>
            </div>

            {/* New Task Button */}
            <Link href="/new-task">
              <Button className="bg-[#007BFF] hover:bg-[#0056b3] text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </Link>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{userEmail}</span>
              </div>
              <form action={signOut}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
