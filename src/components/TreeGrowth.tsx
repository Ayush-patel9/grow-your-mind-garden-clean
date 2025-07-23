import { TreePine, Leaf } from 'lucide-react';
import treeIcon from '@/assets/tree-icon.png';

interface TreeGrowthProps {
  level: number; // 0-100
}

export const TreeGrowth = ({ level }: TreeGrowthProps) => {
  const treeHeight = Math.max(20, (level / 100) * 200);
  const leafCount = Math.floor(level / 20);
  
  return (
    <div className="flex flex-col items-center justify-end h-64 relative bg-gradient-to-b from-accent/20 to-accent/10 rounded-lg p-6">
      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-secondary to-accent rounded-b-lg" />
      
      {/* Tree Container */}
      <div className="relative flex flex-col items-center justify-end" style={{ height: `${treeHeight}px` }}>
        {/* Floating Leaves Animation */}
        {Array.from({ length: leafCount }).map((_, i) => (
          <Leaf
            key={i}
            className={`absolute text-primary animate-pulse-growth`}
            size={16}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
        
        {/* Main Tree */}
        <div className="relative">
          <img 
            src={treeIcon} 
            alt="Growing Tree" 
            className="w-20 h-20 object-contain animate-grow"
            style={{
              filter: `hue-rotate(${level * 0.5}deg) saturate(${1 + level / 100})`,
              transform: `scale(${0.5 + (level / 100) * 0.5})`,
            }}
          />
          
          {/* Growth Glow Effect */}
          {level > 50 && (
            <div className="absolute inset-0 bg-primary-glow/30 rounded-full blur-lg animate-pulse-growth" />
          )}
        </div>
      </div>
      
      {/* Progress Text */}
      <div className="absolute top-4 left-4 right-4 text-center">
        <p className="text-lg font-semibold text-foreground">Growth Level</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="flex-1 bg-secondary rounded-full h-2">
            <div 
              className="bg-gradient-forest h-2 rounded-full transition-all duration-500"
              style={{ width: `${level}%` }}
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{level}%</span>
        </div>
      </div>

      {/* Growth Messages */}
      <div className="absolute bottom-16 text-center">
        {level === 0 && (
          <p className="text-sm text-muted-foreground animate-fade-in-up">
            🌱 Plant your first seed by completing tasks
          </p>
        )}
        {level > 0 && level < 25 && (
          <p className="text-sm text-primary animate-fade-in-up">
            🌿 Your seedling is sprouting!
          </p>
        )}
        {level >= 25 && level < 50 && (
          <p className="text-sm text-primary animate-fade-in-up">
            🌳 Growing strong and tall!
          </p>
        )}
        {level >= 50 && level < 75 && (
          <p className="text-sm text-primary animate-fade-in-up">
            🌲 A magnificent tree emerges!
          </p>
        )}
        {level >= 75 && (
          <p className="text-sm text-primary animate-fade-in-up">
            🏆 Your forest is thriving!
          </p>
        )}
      </div>
    </div>
  );
};