import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  Images,
  CalendarDays,
  FileText,
  Settings,
  UserCircle,
} from 'lucide-react';
import { ADMIN_BASE } from './config.js';

// हरेक बटनको: नाम (label), URL (to), आइकन (icon)
export const NAV_ITEMS = [
  { label: 'Dashboard', to: `${ADMIN_BASE}/dashboard`, icon: LayoutDashboard },
  { label: 'Menu Management', to: `${ADMIN_BASE}/menu`, icon: UtensilsCrossed },
  { label: 'Categories', to: `${ADMIN_BASE}/categories`, icon: Tags },
  { label: 'Gallery Management', to: `${ADMIN_BASE}/gallery`, icon: Images },
  { label: 'Reservations', to: `${ADMIN_BASE}/reservations`, icon: CalendarDays },
 
  { label: 'Homepage Content', to: `${ADMIN_BASE}/homepage`, icon: FileText },
  { label: 'Website Settings', to: `${ADMIN_BASE}/settings`, icon: Settings },
  { label: 'Admin Profile', to: `${ADMIN_BASE}/profile`, icon: UserCircle },
];