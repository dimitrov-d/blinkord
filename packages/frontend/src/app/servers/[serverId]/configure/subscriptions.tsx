import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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

export default function MySubscriptions({ serverName }: { serverName: string }) {
  const { serverId } = useParams<{ serverId: string }>();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
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

  const totalPages = Math.ceil(subscriptions.length / recordsPerPage);
  const currentSubscriptions = subscriptions.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const totalSOLAmount = subscriptions.reduce((total, subscription) => {
    console.log(subscription.role.amount);
    return total + parseFloat(subscription.role.amount);
  }, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Subscriptions for {serverName}</h2>
      <Separator className="my-4" />
      {subscriptions.length > 0 ? (
        <>
          <table className="min-w-full bg-white dark:bg-gray-800">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Purchase Date</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Discord User ID</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Expires At</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">Role Name</th>
                <th className="py-2 px-4 border-b dark:border-gray-700 text-left">SOL Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentSubscriptions.map((subscription) => (
                <tr key={subscription.id}>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                    {subscription.createTime ? new Date(subscription.createTime).toLocaleString() : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">{subscription.discordUserId}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">
                    {subscription.expiresAt ? new Date(subscription.expiresAt).toLocaleString() : "Never"}
                  </td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">{subscription.role.name}</td>
                  <td className="py-2 px-4 border-b dark:border-gray-700 text-left">{subscription.role.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <div>
              <Button
                className="mr-2"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div>
              <p>Total Records: {subscriptions.length}</p>
              <p>Total SOL Amount: {totalSOLAmount.toFixed(4)}</p>
            </div>
          </div>
        </>
      ) : (
        <p>No subscriptions found.</p>
      )}
    </div>
  );
}