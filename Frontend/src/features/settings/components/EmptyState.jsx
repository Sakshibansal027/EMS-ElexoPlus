import { Inbox } from "lucide-react";

const EmptyState = ({ message = "No data found." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Inbox size={32} className="text-muted-foreground" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyState;
