'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';
import { Search, Save, Share, Download, User, LogOut, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSave?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  projectName?: string;
  boardId?: string;
  items: Array<{
    id: string;
    size: { width: number; height: number };
    type: string;
    title: string;
    zIndex: number;
    content: string;
    position: { x: number; y: number };
    isAttached: boolean;
    connections: any[];
  }>;
}

export function TopBar({
  searchQuery,
  items,
  onSearchChange,
  onSave,
  onExport,
  onShare,
  projectName = "Untitled Whiteboard",
  boardId
}: TopBarProps) {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showUserDialog, setShowUserDialog] = React.useState(false);

  // Helper to render input row
  const renderInput = (label: string, value: any) => (
    <div className="mb-3">
      <label className="block text-xs font-semibold mb-1 text-muted-foreground">{label}</label>
      <input
        className="w-full px-3 py-2 rounded border bg-muted/50 text-xs text-foreground"
        value={typeof value === 'object' ? JSON.stringify(value) : value ?? ''}
        readOnly
      />
    </div>
  );

  const handleExportPDF = React.useCallback(() => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    doc.setFont('helvetica');
    doc.setFontSize(18);
    doc.text(`${projectName} - Whiteboard Items`, 40, 50);
    doc.setFontSize(12);
    doc.text('تم التصدير بتاريخ: ' + new Date().toLocaleString(), 40, 70);
    const tableHead = [
      ['العنوان | Title', 'النوع | Type', 'المحتوى/الرابط | Content/URL', 'الموقع | Position (x,y)', 'الحجم | Size (w,h)']
    ];
    const tableBody = items.map(item => [
      item.title,
      item.type,
      item.content,
      `(${item.position.x}, ${item.position.y})`,
      `(${item.size.width}, ${item.size.height})`
    ]);

    autoTable(doc, {
      startY: 90,
      head: tableHead,
      body: tableBody,
      styles: { font: 'helvetica', fontSize: 11, cellPadding: 4 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, halign: 'center' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 40, right: 40 },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 60 },
        2: { cellWidth: 220 },
        3: { cellWidth: 80 },
        4: { cellWidth: 80 },
      },
    });

    doc.save(`${projectName.replace(/\s+/g, '_')}_export.pdf`);
    toast({ description: 'PDF exported success!' });
    if (onExport) onExport();
  }, [items, projectName, toast, onExport]);

  const handleShare = React.useCallback(() => {
    let shareUrl = '';
    if (boardId) {
      shareUrl = `${window.location.origin}/whiteboard/${boardId}`;
    } else {
      shareUrl = window.location.href;
    }
    navigator.clipboard.writeText(shareUrl);
    toast({ description: 'Link copied to clipboard!' });
    if (onShare) onShare();
  }, [boardId, onShare, toast]);

  return (
    <div className="w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4 px-4 py-2">
        {/* Center Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 h-9 bg-muted/50"
            />
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-2">
          {/* Quick Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              title="Save (Ctrl+S)"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Save</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportPDF}
              title="Export"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              title="Share"
            >
              <Share className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Share</span>
            </Button>

          </div>

          {/* User Info Dialog */}
          <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
            <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <DialogHeader className=''>
                <div className='w-full flex items-center justify-center  '>
      <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className='text-2xl'>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                    
                  </AvatarFallback>
                </Avatar>
                </div>
           
                <DialogTitle>  (User Info)</DialogTitle>
                  
                <DialogDescription>
                  All of the user Info 
                </DialogDescription>
              </DialogHeader>
              <div>
                <h3 className="font-bold mb-2 text-sm"> user data</h3>
                {renderInput('email', user?.email)}
                {renderInput(
                  'confirmed_at',
                  user?.confirmed_at
                  ? new Date(user.confirmed_at).toLocaleString()
                  : ''
                )}
                {renderInput(
                  'created_at',
                  user?.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : ''
                )}
                {renderInput(
                  'last_sign_in_at',
                  user?.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : ''
                )}
                {renderInput(
                  'updated_at',
                  user?.updated_at
                  ? new Date(user.updated_at).toLocaleString()
                  : ''
                )}
              
              </div>
            </DialogContent>
          </Dialog>

          <div className="h-6 w-px bg-border" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {(user?.email ? user.email.charAt(0).toUpperCase() : 'U')}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem               onClick={() => setShowUserDialog(true)}
>
                <User  className="mr-2 h-4 w-4" />
                <span>{user?.user_metadata?.full_name ?? 'User'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
