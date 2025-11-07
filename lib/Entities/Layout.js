import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Music, Search, Plus, Calendar, Settings as SettingsIcon, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Browse Equipment",
    url: createPageUrl("Home"),
    icon: Search,
  },
  {
    title: "List Your Gear",
    url: createPageUrl("ListEquipment"),
    icon: Plus,
  },
  {
    title: "My Bookings",
    url: createPageUrl("MyBookings"),
    icon: Calendar,
  },
  {
    title: "My Equipment",
    url: createPageUrl("MyEquipment"),
    icon: Music,
  },
  {
    title: "Settings",
    url: createPageUrl("Settings"),
    icon: SettingsIcon,
  },
];

function SidebarContent_({ children }) {
  const { setOpenMobile } = useSidebar();
  const location = useLocation();

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false,
  });

  return (
    <>
      <style>{`
        :root {
          --primary: 0 100% 50%;
          --primary-foreground: 0 0% 100%;
          --accent: 220 100% 50%;
          --sidebar-background: 0 0% 0%;
          --sidebar-foreground: 0 0% 100%;
        }
        body {
          background: #000;
        }
        [data-sidebar="sidebar"] {
          background-color: #000 !important;
        }
      `}</style>
      <Sidebar className="border-r border-gray-800 bg-black" style={{ backgroundColor: '#000' }}>
        <SidebarHeader className="border-b border-gray-800 p-4 bg-black">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ff2f00d0c393d22378a59d/929a6ce75_Rntllogophotoroom1.png"
                alt="RNTL Logo"
                className="w-12 h-12 object-contain relative z-10"
              />
              <div className="absolute bottom-0 left-0 w-8 h-8 bg-blue-600 rounded-full blur-xl opacity-70"></div>
              <div className="absolute top-0 right-0 w-8 h-8 bg-red-600 rounded-full blur-xl opacity-70"></div>
            </div>
            <div>
              <h2 className="font-bold text-xl text-white">
                RNTL
              </h2>
              <p className="text-xs text-gray-400">SHARE THE SOUND</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-2 bg-black">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
              Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      className={`hover:bg-gray-900 hover:text-cyan-400 transition-all duration-200 rounded-lg mb-1 ${
                        location.pathname === item.url ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white hover:from-red-700 hover:to-blue-700 hover:text-white' : 'text-gray-300'
                      }`}
                    >
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-3 px-3 py-2"
                        onClick={() => setOpenMobile(false)}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-800 p-4 bg-black">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 text-sm truncate">{user.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => base44.auth.logout()}
                className="text-xs text-gray-400 hover:text-cyan-400 hover:bg-gray-900"
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => base44.auth.redirectToLogin()}
              className="w-full bg-cyan-400 text-black hover:bg-cyan-300 font-semibold"
            >
              Login
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>

      <main className="flex-1 flex flex-col bg-black">
        <header className="bg-black border-b border-gray-800 px-6 py-4 md:hidden sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="hover:bg-gray-900 p-2 rounded-lg transition-colors duration-200 text-gray-300" />
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68ff2f00d0c393d22378a59d/929a6ce75_Rntllogophotoroom1.png"
                  alt="RNTL"
                  className="w-6 h-6 object-contain relative z-10"
                />
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-blue-600 rounded-full blur-lg opacity-70"></div>
                <div className="absolute top-0 right-0 w-4 h-4 bg-red-600 rounded-full blur-lg opacity-70"></div>
              </div>
              <h1 className="text-lg font-bold text-white">
                RNTL
              </h1>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black">
        <SidebarContent_>{children}</SidebarContent_>
      </div>
    </SidebarProvider>
  );
}