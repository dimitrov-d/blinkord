'use client'

import { useRouter, useParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Settings2Icon, DollarSignIcon, ChevronLeftIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ServersLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { serverId } = useParams()

  const isManagePage = pathname === `/servers/${serverId}/manage`

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      {serverId && (
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => router.push("/servers")}
              className="flex items-center"
            >
              <ChevronLeftIcon className="mr-2 h-4 w-4" />
              Back to Servers
            </Button>
          </div>
          <div className="flex justify-center">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <Button
                variant="ghost"
                onClick={() => router.push(`/servers/${serverId}/manage`)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-l-lg",
                  isManagePage
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-gray-900 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-600"
                )}
              >
                <Settings2Icon className="mr-2 h-4 w-4" />
                Manage Server
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push(`/servers/${serverId}/create`)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-r-lg",
                  !isManagePage
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-gray-900 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-600"
                )}
              >
                <DollarSignIcon className="mr-2 h-4 w-4" />
                Create Paid Roles
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
        {children}
      </div>
    </div>
  )
}