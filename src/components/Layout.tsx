import React, { useEffect, useRef } from 'react';
import { 
  LayoutDashboard, BookOpen, Languages, PenLine, FileText, Headphones, BookText, 
  Mic, ClipboardCheck, RotateCcw, ChartNoAxesColumn, Settings, Menu, X, Moon, Sun, PanelLeftClose, PanelLeft, Flame, BookMarked, Map as MapIcon,
  Heart, Zap
} from 'lucide-react';
import { useTheme } from '../store/ThemeContext';
import { useProgress } from '../store/ProgressContext';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const { progress } = useProgress();
  
  const mainRef = useRef<HTMLElement>(null);
  const scrollPositions = useRef<Record<string, number>>({});
  const prevView = useRef(currentView);

  useEffect(() => {
    // Save scroll position of the previous view before we change it
    if (mainRef.current && prevView.current !== currentView) {
      // Actually, we need to capture this *before* currentView changes, 
      // but since we're in useEffect it's already changed.
      // So let's handle scroll restoration instead.
      
      const savedPosition = scrollPositions.current[currentView] || 0;
      
      // We use smooth scrolling for restoration as requested
      mainRef.current.scrollTo({
        top: savedPosition,
        behavior: savedPosition === 0 ? 'auto' : 'smooth' // Instantly go to top if 0, else smooth scroll
      });
      
      prevView.current = currentView;
    }
  }, [currentView]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    scrollPositions.current[currentView] = e.currentTarget.scrollTop;
  };

  const navGroups = [
    {
      title: 'Home',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'learning-path', label: 'Path', icon: MapIcon },
      ]
    },
    {
      title: 'Learn',
      items: [
        { id: 'vocabulary', label: 'Vocabulary', icon: BookOpen },
        { id: 'grammatik', label: 'Grammatik', icon: BookMarked },
      ]
    },
    {
      title: 'Practice',
      items: [
        { id: 'horen', label: 'Hören', icon: Headphones },
        { id: 'lesen', label: 'Lesen', icon: BookText },
        { id: 'schreiben', label: 'Schreiben', icon: PenLine },
        { id: 'sprechen', label: 'Sprechen', icon: Mic },
      ]
    },
    {
      title: 'Exam',
      items: [
        { id: 'mocktest', label: 'Mock Test', icon: ClipboardCheck },
      ]
    },
    {
      title: 'Track',
      items: [
        { id: 'mistakes', label: 'Mistakes', icon: RotateCcw },
        { id: 'progress', label: 'Progress', icon: ChartNoAxesColumn },
      ]
    }
  ];
  
  // Need to import BookMarked dynamically or replace it since it wasn't in the import list. I'll add BookMarked to imports.

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };
  
  const bottomNavItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'vocabulary', label: 'Learn', icon: BookOpen },
    { id: 'lesen', label: 'Practice', icon: PenLine },
    { id: 'mocktest', label: 'Exam', icon: ClipboardCheck },
    { id: 'progress', label: 'Progress', icon: ChartNoAxesColumn },
  ];

  return (
    <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans overflow-hidden">
      
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4 z-20">
        <div className="font-semibold text-lg flex items-center gap-2">
          A1 Trainer
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-red-500 font-bold">
            <Heart size={18} className="fill-current" /> {progress?.hearts || 0}
          </div>
          <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-bold">
            <Flame size={18} className="fill-current" /> {progress?.currentStreak || 0}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 text-neutral-600 dark:text-neutral-400">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <nav className={`
        hidden md:flex flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-in-out z-10
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
      `}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
          {!sidebarCollapsed && (
            <div className="font-bold text-lg flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <span className="w-6 h-6 rounded bg-primary-600 flex items-center justify-center text-white text-xs">🇩🇪</span>
              A1 Trainer
            </div>
          )}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`p-2 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${sidebarCollapsed ? 'mx-auto' : ''}`}
          >
            {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelLeftClose size={20} />}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scroll-smooth">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2 px-3">
                  {group.title}
                </div>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id || (item.id === 'lesen' && ['schreiben', 'sprechen', 'horen'].includes(currentView));
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left group
                      ${isActive 
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium' 
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }
                      ${sidebarCollapsed ? 'justify-center px-0' : ''}
                    `}
                  >
                    <Icon size={20} className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100'} />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
           <button
            onClick={() => handleNav('settings')}
            title={sidebarCollapsed ? "Settings" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left text-sm ${sidebarCollapsed ? 'justify-center px-0' : ''} ${currentView === 'settings' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium' : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
          >
            <Settings size={20} />
            {!sidebarCollapsed && "Settings"}
          </button>
          <button
            onClick={toggleTheme}
            title={sidebarCollapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {!sidebarCollapsed && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
          </button>
        </div>
      </nav>

      {/* Mobile More Menu Overlay */}
      <div className={`
        md:hidden fixed inset-0 z-30 bg-black/50 transition-opacity duration-300
        ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `} onClick={() => setMobileMenuOpen(false)}>
        <div 
          className={`absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-neutral-900 shadow-xl transition-transform duration-300 transform ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="h-14 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
            <span className="font-bold">More Options</span>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2"><X size={20} /></button>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-3.5rem)] scroll-smooth">
             {navGroups.map((group, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2 px-3">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ))}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
               <button
                onClick={() => handleNav('settings')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Settings size={18} /> Settings
              </button>
              <button
                onClick={() => { toggleTheme(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} Toggle Theme
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main ref={mainRef} onScroll={handleScroll} className="flex-1 overflow-y-auto w-full pt-14 md:pt-0 pb-16 md:pb-0 relative scroll-smooth">
        
        {/* Desktop Header area if needed, or just let content handle it */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 sticky top-0 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-md z-10 border-b border-transparent">
          <div className="font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
            {currentView.replace('-', ' ')}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-sm text-sm font-medium text-red-500">
              <Heart size={16} className="fill-current" />
              {progress?.hearts || 0}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-sm text-sm font-medium text-yellow-500">
              <Zap size={16} className="fill-current" />
              {progress?.xp || 0} XP
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-sm text-sm font-medium">
              <Flame size={16} className="text-orange-500 fill-orange-500" />
              {progress?.currentStreak || 0}
            </div>
            <button onClick={() => handleNav('settings')} className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
              <Settings size={16} />
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-300">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-around px-2 z-20 pb-safe">
        {bottomNavItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (item.id === 'lesen' && ['schreiben', 'sprechen', 'horen', 'grammatik'].includes(currentView));
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-500 dark:text-neutral-400'}`}
            >
              <Icon size={20} className={isActive ? 'fill-current opacity-20' : ''} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  );
}
