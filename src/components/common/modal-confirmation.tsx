import { toast } from "sonner";

type ConfirmationModalProps = {
  title: string;
  description: string;
  onConfirm: () => void;
};

export function modalConfirmation({
  title = "Are you sure you want to delete this item?",
  description = "This action cannot be undone.",
  onConfirm: handleConfirmDelete,
}: ConfirmationModalProps) {
  toast.custom((t) => (
    <div className="flex flex-col gap-4 bg-background border rounded-lg p-4 shadow-lg min-w-87.5">
      <div>
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t)}
          className="px-4 py-2 text-sm rounded-md border hover:bg-accent"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            toast.dismiss(t);
            handleConfirmDelete();
          }}
          className="px-4 py-2 text-sm rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Delete
        </button>
      </div>
    </div>
  ));
}
