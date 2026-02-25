import { Home, User, Heart, Shield, LayoutDashboard, Activity } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const navItemKeys = [
  { titleKey: "sidebar.home", href: "#home", icon: Home },
  { titleKey: "sidebar.healthProfile", href: "#profile", icon: User },
  { titleKey: "sidebar.heartRate", href: "/rppg", icon: Activity, isRoute: true },
  { titleKey: "sidebar.firstAid", href: "#first-aid", icon: Heart },
  { titleKey: "sidebar.warriors", href: "#warriors", icon: Shield },
  { titleKey: "sidebar.dashboard", href: "#sos", icon: LayoutDashboard },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { t } = useLanguage();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className={cn("border-r border-border transition-all duration-300 ease-in-out", collapsed ? "w-16" : "w-64")}>
      <SidebarHeader className="p-4 border-b border-border">
        <div className={cn("flex items-center gap-3 transition-all duration-300", collapsed && "justify-center")}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className={cn("font-bold text-lg text-foreground transition-all duration-300 whitespace-nowrap overflow-hidden", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
            Sanjeevani
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItemKeys.map((item) => (
                <SidebarMenuItem key={item.titleKey}>
                  <SidebarMenuButton asChild tooltip={t(item.titleKey)}>
                    {item.isRoute ? (
                      <Link to={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg hover:bg-muted transition-all duration-200 group", collapsed && "justify-center px-2")}>
                        <item.icon className="h-5 w-5 text-primary flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <span className={cn("font-medium transition-all duration-300 whitespace-nowrap overflow-hidden", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>{t(item.titleKey)}</span>
                      </Link>
                    ) : (
                      <a href={item.href} className={cn("flex items-center gap-3 px-3 py-2.5 mx-2 rounded-lg hover:bg-muted transition-all duration-200 group", collapsed && "justify-center px-2")}>
                        <item.icon className="h-5 w-5 text-primary flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <span className={cn("font-medium transition-all duration-300 whitespace-nowrap overflow-hidden", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>{t(item.titleKey)}</span>
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
