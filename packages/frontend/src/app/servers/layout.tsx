"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ServersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { serverId } = useParams();
  const pathname = usePathname();

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
            {!isSuccessPage && (
              <Button
                variant="default"
                onClick={() => router.push(`/servers/${serverId}/manage`)}
                className="flex items-center"
              >
                Manage Blink
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}
