import * as React from 'react';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/lib/theme';
import { navigate } from '@/navigation';
import { ComponentsPage } from '@/pages/ComponentsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LoginPage } from '@/pages/LoginPage';

const pages = {
  dashboard: { title: 'Dashboard', icon: '▤', Page: DashboardPage },
  components: { title: 'Components', icon: '◆', Page: ComponentsPage },
  settings: { title: 'Settings', icon: '⚙', Page: SettingsPage },
};

type PageKey = keyof typeof pages;

/**
 * Shows a page's render error in place of the page. Without it, an error in
 * any component unmounts the whole app.
 */
class PageErrorBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Alert variant="destructive">
        <AlertTitle>This page failed to render</AlertTitle>
        <AlertDescription>{String(this.state.error.message ?? this.state.error)}</AlertDescription>
      </Alert>
    );
  }
}

/** The app's frame: a sidebar to switch pages, and a header over the page. */
export function AppShell() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const { appearance, toggle } = useTheme();
  const { title, Page } = pages[page];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex flex-row items-center gap-2 px-2 py-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <span className="text-sm font-bold text-sidebar-primary-foreground">N</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">Acme Inc</span>
              <span className="text-xs text-sidebar-foreground/70">Enterprise</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {(Object.keys(pages) as PageKey[]).map((key) => (
                  <SidebarMenuItem key={key}>
                    <SidebarMenuButton isActive={key === page} onClick={() => setPage(key)}>
                      <span className="w-4 text-center text-sm text-sidebar-foreground">{pages[key].icon}</span>
                      {pages[key].title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarSeparator />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate(LoginPage)}>
                <span className="w-4 text-center text-sm text-sidebar-foreground">↩</span>
                Sign out
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex flex-row items-center gap-2 border-b border-border px-4 py-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-1 h-4 self-center" />
          <span className="flex-1 text-base font-medium text-foreground">{title}</span>
          <Button variant="outline" size="sm" onClick={toggle}>
            {appearance === 'dark' ? '☀ Light' : '☾ Dark'}
          </Button>
        </header>
        {/* Keyed by page, so each page opens at the top. */}
        <scroll key={page} className="min-h-0 flex-1">
          <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4">
            <PageErrorBoundary key={page}>
              <Page />
            </PageErrorBoundary>
          </main>
        </scroll>
      </SidebarInset>
    </SidebarProvider>
  );
}
