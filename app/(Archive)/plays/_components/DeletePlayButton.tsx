import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deletePlayAction } from "@/drizzle/actions/Plays";
import type { Play } from "@/drizzle/Types/types";
import { Trash2 } from "lucide-react";

const DeletePlayButton = ({ play }: { play: Play }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-xs"
          className="bg-stone-900/80 hover:bg-stone-800 text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 className="text-red-400" />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Play</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &ldquo;{play.name}&rdquo;? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={async () => {
              const result = await deletePlayAction(play.id);
              if (result?.error) {
                toast.error(result.message ?? "Failed to delete");
              } else {
                toast.success("Play deleted");
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePlayButton;
