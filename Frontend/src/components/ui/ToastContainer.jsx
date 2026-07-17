import useNotifications from "../../contexts/useNotifications";
import Toast from "./Toast";

const ToastContainer = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div
      className="
        pointer-events-none
        fixed
        right-6
        top-28
        z-[9999]
        flex
        flex-col
        gap-3
      "
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            id={toast.id}
            title={toast.title}
            message={toast.message}
            type={toast.type}
            onDismiss={removeToast}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
