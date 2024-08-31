"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, EyeIcon, SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ServersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { serverId } = useParams();

  const isManagePage = pathname === `/servers/${serverId}/manage`;
  const isSuccessPage = pathname === `/servers/${serverId}/success`;

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
          {!isSuccessPage && (
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
                  <EyeIcon className="mr-2 h-4 w-4" />
                  Preview Blink
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
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Configure Blink Info
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}
