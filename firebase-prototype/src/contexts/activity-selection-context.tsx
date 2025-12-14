
'use client';

import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import type { Activity } from '@/lib/types';

type ActivitySelectionContextType = {
    selectedActivities: string[];
    setSelectedActivities: React.Dispatch<React.SetStateAction<string[]>>;
    toggleActivitySelection: (id: string) => void;
    paginatedActivities: Activity[];
    setPaginatedActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
    allOnPageSelected: boolean;
    toggleSelectAll: (select: boolean) => void;
    setAllActivities: (ids: string[]) => void;
};

const ActivitySelectionContext = createContext<ActivitySelectionContextType | undefined>(undefined);

export function ActivitySelectionProvider({ children }: { children: ReactNode }) {
    const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
    const [paginatedActivities, setPaginatedActivities] = useState<Activity[]>([]);
    const [allActivityIds, setAllActivities] = useState<string[]>([]);

    const toggleActivitySelection = (id: string) => {
        setSelectedActivities(prev =>
            prev.includes(id) ? prev.filter(activityId => activityId !== id) : [...prev, id]
        );
    };

    const allOnPageSelected = useMemo(() => {
        if (allActivityIds.length === 0) return false;
        return allActivityIds.every(id => selectedActivities.includes(id));
    }, [selectedActivities, allActivityIds]);


    const toggleSelectAll = (select: boolean) => {
        if (select) {
            setSelectedActivities(prev => [...new Set([...prev, ...allActivityIds])]);
        } else {
            setSelectedActivities(prev => prev.filter(id => !allActivityIds.includes(id)));
        }
    };

    const value = {
        selectedActivities,
        setSelectedActivities,
        toggleActivitySelection,
        paginatedActivities,
        setPaginatedActivities,
        allOnPageSelected,
        toggleSelectAll,
        setAllActivities,
    };

    return (
        <ActivitySelectionContext.Provider value={value}>
            {children}
        </ActivitySelectionContext.Provider>
    );
}

export function useActivitySelection() {
    const context = useContext(ActivitySelectionContext);
    if (context === undefined) {
        throw new Error('useActivitySelection must be used within a ActivitySelectionProvider');
    }
    return context;
}
