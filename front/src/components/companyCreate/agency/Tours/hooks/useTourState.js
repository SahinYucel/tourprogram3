import { useState, useEffect } from 'react';
import { INITIAL_TOUR_STATE } from './constants';

export const useTourState = () => {
  const [tourData, setTourData] = useState(() => {
    const savedData = localStorage.getItem('currentTourData');
    console.log('LocalStorage - currentTourData:', savedData ? JSON.parse(savedData) : INITIAL_TOUR_STATE);
    return savedData ? JSON.parse(savedData) : INITIAL_TOUR_STATE;
  });

  const [createdTours, setCreatedTours] = useState(() => {
    const saved = localStorage.getItem('createdTours');
    console.log('LocalStorage - createdTours:', saved ? JSON.parse(saved) : []);
    return saved ? JSON.parse(saved) : [];
  });

  const [editingIndex, setEditingIndex] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showActive, setShowActive] = useState('all');

  useEffect(() => {
    console.log('Saving to LocalStorage - createdTours:', createdTours);
    localStorage.setItem('createdTours', JSON.stringify(createdTours));
  }, [createdTours]);

  useEffect(() => {
    console.log('Saving to LocalStorage - currentTourData:', tourData);
    localStorage.setItem('currentTourData', JSON.stringify(tourData));
  }, [tourData]);

  return {
    tourData,
    setTourData,
    createdTours,
    setCreatedTours,
    editingIndex,
    setEditingIndex,
    isCollapsed,
    setIsCollapsed,
    searchQuery,
    setSearchQuery,
    showActive,
    setShowActive
  };
}; 