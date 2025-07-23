import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Folder, FileText, Plus, Search, Tag, Pin } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder: string;
  pinned: boolean;
  createdAt: Date;
}

interface NotesModuleProps {
  onNotesChange: (count: number) => void;
}

export const NotesModule = ({ onNotesChange }: NotesModuleProps) => {
  const [notes, setNotes] = useLocalStorage<Note[]>('growmind-notes', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: '',
    folder: 'General'
  });

  const folders = ['All', 'General', 'Ideas', 'Meetings', 'Personal', 'Work'];
  const tagPresets = ['Idea', 'Reminder', 'Meeting', 'Important', 'TODO', 'Research'];

  useEffect(() => {
    onNotesChange(notes.length);
  }, [notes, onNotesChange]);

  const createNote = () => {
    if (!newNote.title.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      folder: newNote.folder,
      pinned: false,
      createdAt: new Date()
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({ title: '', content: '', tags: '', folder: 'General' });
    setIsCreateDialogOpen(false);
  };

  const togglePin = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const filteredNotes = notes
    .filter(note => selectedFolder === 'All' || note.folder === selectedFolder)
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-card/90 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="text-primary" />
              Notes Garden
            </CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-forest">
                  <Plus className="mr-2" size={16} />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card">
                <DialogHeader>
                  <DialogTitle>Plant a New Idea</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Note title..."
                    value={newNote.title}
                    onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <select
                    className="w-full p-2 border rounded-md bg-background"
                    value={newNote.folder}
                    onChange={(e) => setNewNote(prev => ({ ...prev, folder: e.target.value }))}
                  >
                    {folders.slice(1).map(folder => (
                      <option key={folder} value={folder}>{folder}</option>
                    ))}
                  </select>
                  <Textarea
                    placeholder="Your thoughts..."
                    rows={6}
                    value={newNote.content}
                    onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  />
                  <div>
                    <Input
                      placeholder="Tags (comma-separated)"
                      value={newNote.tags}
                      onChange={(e) => setNewNote(prev => ({ ...prev, tags: e.target.value }))}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tagPresets.map(tag => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => {
                            const currentTags = newNote.tags ? newNote.tags + ', ' : '';
                            setNewNote(prev => ({ ...prev, tags: currentTags + tag }));
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button onClick={createNote} className="w-full bg-gradient-forest">
                    Create Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Folder Tabs */}
          <div className="flex gap-2 flex-wrap">
            {folders.map(folder => (
              <Button
                key={folder}
                variant={selectedFolder === folder ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFolder(folder)}
                className="flex items-center gap-1"
              >
                <Folder size={14} />
                {folder}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3 bg-card/90 backdrop-blur">
            <CardContent className="p-8 text-center">
              <FileText className="mx-auto mb-4 text-muted-foreground" size={48} />
              <p className="text-muted-foreground">
                {searchTerm || selectedFolder !== 'All' 
                  ? "No notes match your search." 
                  : "Start growing your knowledge garden by creating your first note."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map(note => (
            <Card 
              key={note.id} 
              className="bg-card/90 backdrop-blur hover:shadow-growth transition-all duration-300 animate-fade-in-up"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg truncate flex-1">{note.title}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePin(note.id)}
                    className={note.pinned ? "text-primary" : "text-muted-foreground"}
                  >
                    <Pin size={14} />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Folder size={12} />
                  {note.folder}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                  {note.content || "No content yet..."}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag size={8} className="mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};