"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Megaphone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { pushNotificationAction } from "@/drizzle/actions/Notifications";
import { useSession } from "@/lib/auth/hooks/useSession";

const AdminNotifyPage = () => {
  const router = useRouter();
  const sessionUser = useSession();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  if (sessionUser && sessionUser.role !== "admin") {
    router.push("/home");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSending(true);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("message", message);
    const result = await pushNotificationAction(formData);
    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      setTitle("");
      setMessage("");
    }
    setSending(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Send Notification</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Push a notification to all actors
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-stone-300 mb-1 block">
            Title *
          </label>
          <Input
            placeholder="Notification title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-stone-300 mb-1 block">
            Message
          </label>
          <Textarea
            placeholder="Optional message body"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
        <Button type="submit" disabled={!title.trim() || sending} className="gap-2">
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Megaphone className="w-4 h-4" />
          )}
          {sending ? "Sending..." : "Send to All Actors"}
        </Button>
      </form>
    </div>
  );
};

export default AdminNotifyPage;
