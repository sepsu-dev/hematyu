import React from "react";
import * as Icons from "lucide-react";

export type IconKey = keyof typeof APP_ICONS;

export const APP_ICONS = {
  // Navigation & Core
  "layout-dashboard": Icons.LayoutDashboard,
  "arrow-left-right": Icons.ArrowLeftRight,
  "menu": Icons.Menu,
  "settings": Icons.Settings,
  "home": Icons.Home,
  "bell": Icons.Bell,
  "search": Icons.Search,
  "globe": Icons.Globe,

  // Finance & Money
  "wallet": Icons.Wallet,
  "piggy-bank": Icons.PiggyBank,
  "target": Icons.Target,
  "coins": Icons.Coins,
  "dollar-sign": Icons.DollarSign,
  "percent": Icons.Percent,
  "credit-card": Icons.CreditCard,
  "landmark": Icons.Landmark,
  "shopping-bag": Icons.ShoppingBag,
  "shopping-cart": Icons.ShoppingCart,
  "gift": Icons.Gift,

  // Charts & Reports
  "bar-chart-3": Icons.BarChart3,
  "pie-chart": Icons.PieChart,
  "file-bar-chart": Icons.FileBarChart,
  "trending-up": Icons.TrendingUp,
  "trending-down": Icons.TrendingDown,
  "activity": Icons.Activity,

  // Admin & Users
  "shield-check": Icons.ShieldCheck,
  "users": Icons.Users,
  "user": Icons.User,
  "user-cog": Icons.UserCog,
  "user-plus": Icons.UserPlus,
  "key-round": Icons.KeyRound,
  "lock": Icons.Lock,
  "unlock": Icons.Unlock,
  "log-out": Icons.LogOut,

  // Actions & Operations
  "plus": Icons.Plus,
  "trash-2": Icons.Trash2,
  "pencil": Icons.Pencil,
  "x": Icons.X,
  "check": Icons.Check,
  "edit": Icons.Edit,
  "filter": Icons.Filter,
  "download": Icons.Download,
  "upload": Icons.Upload,
  "refresh-cw": Icons.RefreshCw,
  "more-horizontal": Icons.MoreHorizontal,
  "more-vertical": Icons.MoreVertical,
  "external-link": Icons.ExternalLink,
  "send": Icons.Send,

  // Content & Files
  "list-checks": Icons.ListChecks,
  "list": Icons.List,
  "database": Icons.Database,
  "folder-tree": Icons.FolderTree,
  "folder": Icons.Folder,
  "file": Icons.File,
  "file-text": Icons.FileText,
  "clipboard": Icons.Clipboard,
  "tag": Icons.Tag,
  "book-open": Icons.BookOpen,

  // Utilities & Miscellaneous
  "circle": Icons.Circle,
  "smartphone": Icons.Smartphone,
  "phone": Icons.Phone,
  "mail": Icons.Mail,
  "map-pin": Icons.MapPin,
  "calendar": Icons.Calendar,
  "clock": Icons.Clock,
  "briefcase": Icons.Briefcase,
  "heart": Icons.Heart,
  "star": Icons.Star,
  "image": Icons.Image,
  "info": Icons.Info,
  "alert-circle": Icons.AlertCircle,
  "alert-triangle": Icons.AlertTriangle,
};

export function getIcon(name: string): Icons.LucideIcon {
  return APP_ICONS[name as IconKey] || Icons.Circle;
}

interface IconListProps {
  selected?: string;
  onSelect?: (name: IconKey) => void;
  className?: string;
}

export function IconListGrid({ selected, onSelect, className = "" }: IconListProps) {
  return (
    <div className={`grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1.5 border border-[#E7DED4] rounded-lg bg-white ${className}`}>
      {Object.entries(APP_ICONS).map(([key, Icon]) => {
        const isSelected = selected === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onSelect?.(key as IconKey)}
            title={key}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer ${
              isSelected
                ? "bg-primary/10 border-primary text-primary"
                : "border-[#E7DED4] hover:bg-stone-50 text-stone-500 hover:text-stone-800"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-[8px] font-bold mt-1 text-center truncate w-full">{key}</span>
          </button>
        );
      })}
    </div>
  );
}
