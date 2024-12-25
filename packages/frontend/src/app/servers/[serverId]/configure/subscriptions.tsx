import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useUserStore } from "@/lib/contexts/zustand/userStore";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface Subscription {
  id: string;
  createTime: string;
  discordUserId: string;
  expiresAt: string;
  role: {
    name: string;
    amount: string;
  };
}

export default function MySubscriptions() {
  const { serverId } = useParams<{ serverId: string }>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const token = useUserStore((state) => state.token) || localStorage.getItem("discordToken");

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/discord/guilds/${serverId}/subscriptions`,
          { headers: { Authorization: `Bearer ${token}` }, }
        );

        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data);
        } else {
          toast.error("Failed to fetch subscriptions");
        }
      } catch (error) {
        console.error("Error fetching subscriptions", error);
        toast.error("Error fetching subscriptions");
      }
    };

    if (serverId) {
      fetchSubscriptions();
    }
  }, [serverId, token]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Subscriptions</h2>
      <Separator className="my-4" />
      {subscriptions.length > 0 ? (
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Purchase Date</th>
              <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Discord User ID</th>
              <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Expires At</th>
              <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Role Name</th>
              <th className="py-2 px-4 border-b dark:border-gray-700 text-left">SOL Amount</th>
              <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  {new Date(subscription.createTime).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700 text-left">{subscription.discordUserId}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  {new Date(subscription.expiresAt).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b dark:border-gray-700 text-left">{subscription.role.name}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700 text-left">{subscription.role.amount}</td>
                <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                  <Button variant="destructive" className="flex items-center">
                    <Trash className="mr-2" />
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No subscriptions found.</p>
      )}
    </div>
  );
}