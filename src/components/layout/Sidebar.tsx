import React from 'react';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, Library, History, Film, Music, Gamepad, Trophy, LightbulbIcon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onHomeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onHomeClick }) => {
  const { theme } = useTheme();
  
  const mainNavItems = [
    { icon: <Home size={20} />, label: 'Home', onClick: onHomeClick },
    { icon: <Compass size={20} />, label: 'Explore', onClick: () => console.log('Explore clicked') },
    { icon: <PlaySquare size={20} />, label: 'Shorts', onClick: () => console.log('Shorts clicked') },
    { icon: <Library size={20} />, label: 'Library', onClick: () => console.log('Library clicked') },
  ];

  const secondaryNavItems = [
    { icon: <History size={20} />, label: 'History', onClick: () => console.log('History clicked') },
    { icon: <Clock size={20} />, label: 'Watch Later', onClick: () => console.log('Watch Later clicked') },
    { icon: <ThumbsUp size={20} />, label: 'Liked Videos', onClick: () => console.log('Liked Videos clicked') },
  ];

  const exploreNavItems = [
    { icon: <Film size={20} />, label: 'Movies', onClick: () => console.log('Movies clicked') },
    { icon: <Music size={20} />, label: 'Music', onClick: () => console.log('Music clicked') },
    { icon: <Gamepad size={20} />, label: 'Gaming', onClick: () => console.log('Gaming clicked') },
    { icon: <Trophy size={20} />, label: 'Sports', onClick: () => console.log('Sports clicked') },
    { icon: <LightbulbIcon size={20} />, label: 'Learning', onClick: () => console.log('Learning clicked') },
  ];

  const renderNavItems = (items: any[]) => {
    return items.map((item, index) => (
      <div 
        key={index} 
        onClick={item.onClick}
        className={`flex items-center px-3 py-2 cursor-pointer rounded-lg transition-colors
          ${isOpen ? 'justify-start' : 'justify-center'}
          hover:bg-gray-200 dark:hover:bg-zinc-700`}
      >
        <span className="text-gray-700 dark:text-gray-200">
          {item.icon}
        </span>
        {isOpen && (
          <span className="ml-4 text-sm text-gray-700 dark:text-gray-200">{item.label}</span>
        )}
      </div>
    ));
  };

  const SectionDivider = () => (
    <div className={`my-2 ${isOpen ? 'px-3' : 'px-2'}`}>
      <div className="border-t border-gray-200 dark:border-zinc-700"></div>
    </div>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    isOpen && (
      <h3 className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
        {title}
      </h3>
    )
  );

  return (
    <aside 
      className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] transition-all duration-300 bg-white dark:bg-zinc-900 z-10
        ${isOpen ? 'w-56' : 'w-16'} overflow-y-auto scrollbar-hide`}
    >
      <div className="py-2">
        {renderNavItems(mainNavItems)}

        <SectionDivider />
        
        <SectionTitle title="Your content" />
        {renderNavItems(secondaryNavItems)}

        <SectionDivider />
        
        <SectionTitle title="Explore" />
        {renderNavItems(exploreNavItems)}
      </div>
    </aside>
  );
};

export default Sidebar;