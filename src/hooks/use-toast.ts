import { toast } from "sonner";

type ToastType = "success" | "error" | "warning" | "info" | "loading";

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  dismissible?: boolean;
  important?: boolean;
}

export function useToast() {
  const showToast = (
    type: ToastType,
    title: string,
    options: ToastOptions = {},
  ) => {
    const {
      description,
      action,
      duration,
      dismissible = true,
      important,
    } = options;

    const toastConfig = {
      duration: duration || (type === "error" ? 6000 : 4000),
      dismissible,
      important,
      ...(description && { description }),
      ...(action && { action }),
    };

    switch (type) {
      case "success":
        return toast.success(title, toastConfig);
      case "error":
        return toast.error(title, toastConfig);
      case "warning":
        return toast.warning(title, toastConfig);
      case "info":
        return toast.info(title, toastConfig);
      case "loading":
        return toast.loading(title, toastConfig);
      default:
        return toast(title, toastConfig);
    }
  };

  // Commonly used toast shortcuts
  const success = (title: string, options?: ToastOptions) =>
    showToast("success", title, options);

  const error = (title: string, options?: ToastOptions) =>
    showToast("error", title, options);

  const warning = (title: string, options?: ToastOptions) =>
    showToast("warning", title, options);

  const info = (title: string, options?: ToastOptions) =>
    showToast("info", title, options);

  const loading = (title: string, options?: ToastOptions) =>
    showToast("loading", title, options);

  // Promise toast utility
  const promise = <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      /* eslint-disable @typescript-eslint/no-explicit-any */
      error: string | ((error: any) => string);
    } & ToastOptions,
  ) => {
    const {
      loading: loadingMsg,
      success: successMsg,
      error: errorMsg,
    } = options;

    return toast.promise(promise, {
      loading: loadingMsg,
      success: (data) =>
        typeof successMsg === "function" ? successMsg(data) : successMsg,
      error: (error) =>
        typeof errorMsg === "function" ? errorMsg(error) : errorMsg,
    });
  };

  return {
    toast: showToast,
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss: toast.dismiss,
  };
}

export function useApiToast() {
  const { success, error, warning, promise, loading } = useToast();

  const apiSuccess = (message: string = "Operation completed successfully") => {
    success(message);
  };

  const apiError = (
    errorMsg: string = "Something went wrong",
    details?: string,
  ) => {
    error(errorMsg, {
      description: details,
      duration: 8000, // Longer for errors
      important: true,
    });
  };

  const apiWarning = (message: string, details?: string) => {
    warning(message, {
      description: details,
    });
  };

  const withApiPromise = <T>(
    apiCall: Promise<T>,
    messages: {
      loading: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: any) => string);
    },
  ) => {
    return promise(apiCall, {
      loading: messages.loading,
      success: messages.success || "Operation completed successfully",
      error: messages.error || "Something went wrong",
    });
  };

  // For form submissions
  const formSubmission = <T>(
    submitFn: () => Promise<T>,
    entityName: string = "Item",
  ) => {
    return withApiPromise(submitFn(), {
      loading: `Saving ${entityName}...`,
      success: `${entityName} saved successfully!`,
      error: `Failed to save ${entityName}`,
    });
  };

  // For delete operations
  const deleteWithConfirm = <T>(
    deleteFn: () => Promise<T>,
    entityName: string = "Item",
  ) => {
    return withApiPromise(deleteFn(), {
      loading: `Deleting ${entityName}...`,
      success: `${entityName} deleted successfully!`,
      error: `Failed to delete ${entityName}`,
    });
  };

  return {
    apiSuccess,
    apiError,
    apiWarning,
    withApiPromise,
    formSubmission,
    deleteWithConfirm,
    loading,
  };
}
