import React from "react";
import { AlertTriangle, Info, Trash2, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (variant) {
      case "warning":
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        );
      case "info":
        return (
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Info className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
        );
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case "warning":
        return "bg-amber-500 hover:bg-amber-600 text-white border border-amber-600 shadow-sm";
      case "info":
        return "bg-primary hover:bg-primary/95 text-primary-foreground border border-primary/90 shadow-sm";
      default:
        return "bg-red-600 hover:bg-red-700 text-white border border-red-700 shadow-sm";
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onCancel} />
      
      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E7DED4] p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-4">
          {getIcon()}
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-sm font-extrabold text-stone-900 leading-none">{title}</h3>
            <p className="text-xs text-stone-500 leading-normal">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-50 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-[#E7DED4] text-xs font-bold text-stone-500 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.98] cursor-pointer ${getConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
