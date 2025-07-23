import { useTimer } from '@/contexts/TimerContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TreePine, Sprout, Trees } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const TreeGrowth = () => {
  const { completedSessions, totalMinutes } = useTimer();

  const getTreeComponent = (type: 'small' | 'medium' | 'large', session: any, index: number) => {
    const treeProps = {
      small: { size: 20, color: 'text-green-400', icon: Sprout },
      medium: { size: 28, color: 'text-green-600', icon: TreePine },
      large: { size: 36, color: 'text-green-800', icon: Trees }
    };

    const { size, color, icon: IconComponent } = treeProps[type];
    
    return (
      <TooltipProvider key={session.id}>
        <Tooltip>
          <TooltipTrigger>
            <div className="relative group cursor-pointer">
              <IconComponent 
                size={size} 
                className={`${color} transition-all duration-300 hover:scale-110 drop-shadow-sm`}
              />
              <div className="absolute inset-0 bg-green-300/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-semibold">
                {type === 'small' ? '🌱 Small Tree' : type === 'medium' ? '🌳 Medium Tree' : '🏔️ Large Tree'}
              </p>
              <p className="text-sm">{session.duration} minutes</p>
              <p className="text-xs text-muted-foreground">
                {new Date(session.completedAt).toLocaleDateString()} at{' '}
                {new Date(session.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const treeCounts = {
    small: completedSessions.filter(s => s.type === 'small').length,
    medium: completedSessions.filter(s => s.type === 'medium').length,
    large: completedSessions.filter(s => s.type === 'large').length,
  };

  const totalTrees = completedSessions.length;

  return (
    <Card className="bg-card/90 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trees className="text-primary" />
          Your Forest
          <Badge variant="secondary" className="ml-auto">
            {totalTrees} Trees
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {completedSessions.length === 0 ? (
          <div className="text-center py-8">
            <Sprout className="mx-auto mb-4 text-muted-foreground" size={48} />
            <p className="text-muted-foreground">
              Complete focus sessions to grow your forest!
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              🌱 &lt; 15 min • 🌳 15-45 min • 🏔️ 45+ min
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Tree counts summary */}
            <div className="flex gap-4 justify-center">
              {treeCounts.small > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  🌱 {treeCounts.small}
                </Badge>
              )}
              {treeCounts.medium > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  🌳 {treeCounts.medium}
                </Badge>
              )}
              {treeCounts.large > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  �️ {treeCounts.large}
                </Badge>
              )}
            </div>

            {/* Forest visualization */}
            <div 
              className="grid gap-3 p-4 bg-gradient-to-b from-sky-100 to-green-100 rounded-lg min-h-32"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
                maxHeight: '200px',
                overflowY: 'auto'
              }}
            >
              {completedSessions
                .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
                .map((session, index) => 
                  getTreeComponent(session.type, session, index)
                )}
            </div>

            {/* Stats */}
            <div className="text-center pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                Total Focus Time: <span className="font-semibold text-primary">{totalMinutes} minutes</span>
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};