import React from 'react';
import { PetSearchEngine } from './PetSearchEngine';
import { ActiveScreen } from '../types';

interface SearchLensScreenProps {
  onNavigateToChat: () => void;
  onNavigateToReport: () => void;
  onNavigateToScreen?: (screen: ActiveScreen) => void;
}

export const SearchLensScreen: React.FC<SearchLensScreenProps> = ({
  onNavigateToChat,
  onNavigateToReport,
  onNavigateToScreen,
}) => {
  const handleNavigate = (screen: ActiveScreen) => {
    if (screen === 'chat') {
      onNavigateToChat();
    } else if (screen === 'report') {
      onNavigateToReport();
    } else if (onNavigateToScreen) {
      onNavigateToScreen(screen);
    }
  };

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 py-8">
      <PetSearchEngine onNavigateToScreen={handleNavigate} />
    </div>
  );
};
