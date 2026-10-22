import { useEffect } from "react";

interface FormErrorPopupProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function ErrorMessage({
  message,
  isOpen,
  onClose,
  title = "Что-то пошло не так",
}: FormErrorPopupProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="form-error-title"
        aria-describedby="form-error-message"
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#171717] text-primary shadow-2xl"
      >
        {/* Цветовой акцент */}
        <div className="h-1.5 w-full bg-accent" />

        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent/40 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.3 3.9 1.8 18.2A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />
              </svg>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть предупреждение"
              className="rounded-lg p-2 text-accent-foreground transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="m18 6-12 12M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2
            id="form-error-title"
            className="text-2xl font-black uppercase tracking-tight sm:text-3xl"
          >
            {title}
          </h2>

          <p
            id="form-error-message"
            className="mt-3 text-sm leading-6 text-accent-foreground sm:text-base"
          >
            {message}
          </p>

          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="mt-7 w-full rounded-xl bg-accent px-5 py-3.5 text-sm font-extrabold uppercase tracking-wide text-accent-foreground transition hover:bg-accent/70 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
