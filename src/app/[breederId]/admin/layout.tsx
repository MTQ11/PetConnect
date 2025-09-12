'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PawPrint,
  Palette,
  User,
  MessageSquare,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ breederId: string }>;
}

/**
 * Layout component cho toàn bộ folder admin
 * Tự động wrap tất cả admin pages với sidebar và layout
 */
export default function AdminLayout({ children, params }: AdminLayoutProps) {
  const resolvedParams = use(params);
  const pathname = usePathname();

  // Mock data
  const breederInfo = {
    name: "Golden Grace Breeders",
    email: "info@goldengrace.com",
    phone: "+1 (555) 123-4567",
    address: "123 Breeder Lane, Puppy Valley, CA 90210",
    avatar: "/api/placeholder/150/150",
    description: "Award-winning Golden Retriever & Yorkshire Terrier specialists with over 15 years of experience."
  };

  const messages = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@email.com",
      message: "Hi! I'm interested in Bella. Could you tell me more about her vaccination status?",
      date: "2024-08-28",
      read: false
    },
    {
      id: "2",
      name: "Mike Chen",
      email: "mike@email.com",
      message: "Do you have any Yorkshire Terrier puppies available for next month?",
      date: "2024-08-27",
      read: true
    }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '' },
    { id: 'pets', label: 'Pets Management', icon: PawPrint, href: 'pet-management' },
    { id: 'appearance', label: 'Site Appearance', icon: Palette, href: 'site-appearance' },
    { id: 'profile', label: 'Profile Settings', icon: User, href: 'profile-settings' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, href: 'messages' }
  ];

  const getCurrentPage = () => {
    if (pathname.includes('pet-management')) return 'pets';
    if (pathname.includes('site-appearance')) return 'appearance';
    if (pathname.includes('profile-settings')) return 'profile';
    if (pathname.includes('messages')) return 'messages';
    return 'dashboard';
  };

  const currentPage = getCurrentPage();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r flex flex-col">
        <Card className="border-0 border-b rounded-none">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <Image
                src={breederInfo.avatar}
                alt="Avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-foreground">{breederInfo.name}</h2>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <Link
                    href={`/${resolvedParams.breederId}/admin/${item.href}`}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.id === 'messages' && messages.filter(m => !m.read).length > 0 && (
                      <Badge variant="destructive" className="ml-auto">
                        {messages.filter(m => !m.read).length}
                      </Badge>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
