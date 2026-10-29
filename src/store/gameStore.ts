import { useState, useEffect } from 'react';
import { 
  GamePhase, 
  Chapter, 
  MapBuilding, 
  ScoreBreakdown, 
  FamilyChecklistItem, 
  SocialMessage,
  AchievementBadge 
} from '../types/game';
import { CHAPTERS_DATA } from '../data/chapters';
import { ACHIEVEMENTS } from '../data/achievements';
import { INITIAL_FAMILY_CHECKLIST } from '../data/familyChecklist';
import { soundEngine } from '../game/audio';

const STORAGE_KEY = 'afet72_game_save_v1';

export interface GameStoreState {
  phase: GamePhase;
  currentChapterId: number;
  chapters: Chapter[];
  inspectedBuildingIds: string[];
  selectedBuilding: MapBuilding | null;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  activeDilemmaTask: { chapterId: number; taskId: string } | null;
  packedBagItemIds: string[];
  verifiedMessages: Record<string, 'verified_official' | 'needs_verification' | 'misleading'>;
  selectedRouteId: string | null;
  familyChecklist: FamilyChecklistItem[];
  achievements: AchievementBadge[];
  activeLayers: {
    floodRisk: boolean;
    landslideRisk: boolean;
    closedRoads: boolean;
    safeRoutes: boolean;
  };
  activeModal: 'bag_packer' | 'messages' | 'route_evaluator' | 'chapter_dialogue' | 'chapter_summary' | null;
  showTeacherMode: boolean;
  showFamilyChecklist: boolean;
  showAboutModal: boolean;
  feedbackModal: {
    isOpen: boolean;
    title: string;
    isSafe: boolean;
    feedbackText: string;
    sourceRef?: string;
  } | null;
}

export function useGameStore() {
  const [state, setState] = useState<GameStoreState>(() => {
    // Attempt local storage hydration
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          activeLayers: parsed.activeLayers || {
            floodRisk: true,
            landslideRisk: true,
            closedRoads: true,
            safeRoutes: false,
          },
          scoreBreakdown: parsed.scoreBreakdown || {
            riskDetection: 0,
            preparedness: 0,
            safeDecisionMaking: 0,
            communication: 0,
            inclusivePlanning: 0,
          },
          familyChecklist: parsed.familyChecklist || INITIAL_FAMILY_CHECKLIST,
          achievements: parsed.achievements || ACHIEVEMENTS,
          selectedBuilding: null,
          activeDilemmaTask: null,
          feedbackModal: null,
          activeModal: null,
          showTeacherMode: false,
          showFamilyChecklist: false,
          showAboutModal: false,
        };
      }
    } catch {
      // fallback to initial
    }

    return {
      phase: 'welcome',
      currentChapterId: 0,
      chapters: JSON.parse(JSON.stringify(CHAPTERS_DATA)),
      inspectedBuildingIds: [],
      selectedBuilding: null,
      score: 0,
      scoreBreakdown: {
        riskDetection: 0,
        preparedness: 0,
        safeDecisionMaking: 0,
        communication: 0,
        inclusivePlanning: 0,
      },
      activeDilemmaTask: null,
      packedBagItemIds: [],
      verifiedMessages: {},
      selectedRouteId: null,
      familyChecklist: INITIAL_FAMILY_CHECKLIST,
      achievements: JSON.parse(JSON.stringify(ACHIEVEMENTS)),
      activeLayers: {
        floodRisk: true,
        landslideRisk: true,
        closedRoads: true,
        safeRoutes: false,
      },
      activeModal: null,
      showTeacherMode: false,
      showFamilyChecklist: false,
      showAboutModal: false,
      feedbackModal: null,
    };
  });

  // Auto-save on state change
  useEffect(() => {
    try {
      const toSave = {
        phase: state.phase,
        currentChapterId: state.currentChapterId,
        chapters: state.chapters,
        inspectedBuildingIds: state.inspectedBuildingIds,
        score: state.score,
        scoreBreakdown: state.scoreBreakdown,
        packedBagItemIds: state.packedBagItemIds,
        verifiedMessages: state.verifiedMessages,
        selectedRouteId: state.selectedRouteId,
        familyChecklist: state.familyChecklist,
        achievements: state.achievements,
        activeLayers: state.activeLayers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // silent
    }
  }, [
    state.phase,
    state.currentChapterId,
    state.chapters,
    state.inspectedBuildingIds,
    state.score,
    state.scoreBreakdown,
    state.packedBagItemIds,
    state.verifiedMessages,
    state.selectedRouteId,
    state.familyChecklist,
    state.achievements,
    state.activeLayers,
  ]);

  const currentChapter = state.chapters.find(c => c.id === state.currentChapterId) || state.chapters[0];

  // Action: Start game
  const startGame = () => {
    soundEngine.playSuccess();
    setState(prev => ({
      ...prev,
      phase: 'playing',
      activeModal: 'chapter_dialogue',
    }));
  };

  // Action: Select Building in 3D canvas
  const selectBuilding = (bld: MapBuilding) => {
    setState(prev => {
      const alreadyInspected = prev.inspectedBuildingIds.includes(bld.id);
      const newInspected = alreadyInspected ? prev.inspectedBuildingIds : [...prev.inspectedBuildingIds, bld.id];

      // Check current chapter tasks
      const currCh = prev.chapters.find(c => c.id === prev.currentChapterId);
      let updatedChs = prev.chapters;

      if (currCh) {
        const updatedTasks = currCh.tasks.map(task => {
          if (task.actionType === 'inspect_objects' && !task.completed && task.relatedBuildingIds?.includes(bld.id)) {
            // Count unique inspected buildings for this task
            const inspectedCount = task.relatedBuildingIds.filter(id => newInspected.includes(id)).length;
            const isFinished = inspectedCount >= (task.targetCount || task.relatedBuildingIds.length);
            return {
              ...task,
              currentCount: inspectedCount,
              completed: isFinished,
            };
          }
          return task;
        });

        updatedChs = prev.chapters.map(c => c.id === prev.currentChapterId ? { ...c, tasks: updatedTasks } : c);
      }

      // Check if this unlocked Risk Detective badge
      let updatedAchievements = prev.achievements;
      if (newInspected.length >= 6) {
        updatedAchievements = prev.achievements.map(a => 
          a.id === 'badge_risk_detective' ? { ...a, unlocked: true } : a
        );
      }

      return {
        ...prev,
        selectedBuilding: bld,
        inspectedBuildingIds: newInspected,
        chapters: updatedChs,
        achievements: updatedAchievements,
      };
    });
  };

  // Action: Make a Decision on a Dilemma
  const makeDecision = (taskId: string, choiceId: string) => {
    const ch = currentChapter;
    const task = ch.tasks.find(t => t.id === taskId);
    if (!task || !task.dilemma) return;

    const option = task.dilemma.options.find(o => o.id === choiceId);
    if (!option) return;

    if (option.isSafe) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playWarning();
    }

    // Update Task completion & scores
    setState(prev => {
      const updatedChapters = prev.chapters.map(c => {
        if (c.id === prev.currentChapterId) {
          return {
            ...c,
            tasks: c.tasks.map(t => t.id === taskId ? { ...t, completed: true } : t),
          };
        }
        return c;
      });

      // Calculate score points added
      const delta = option.scoreDelta || (option.isSafe ? 15 : 0);
      const newScore = Math.min(100, prev.score + delta);

      // Score category attribution
      const breakdown = { ...prev.scoreBreakdown };
      if (prev.currentChapterId <= 1) breakdown.riskDetection = Math.min(20, breakdown.riskDetection + delta);
      else if (prev.currentChapterId === 2) breakdown.preparedness = Math.min(25, breakdown.preparedness + delta);
      else if (prev.currentChapterId >= 3 && prev.currentChapterId <= 5) breakdown.safeDecisionMaking = Math.min(30, breakdown.safeDecisionMaking + delta);
      else if (prev.currentChapterId === 7) breakdown.communication = Math.min(15, breakdown.communication + delta);
      else breakdown.inclusivePlanning = Math.min(10, breakdown.inclusivePlanning + delta);

      // Check badge unlocks based on safe decisions
      const updatedBadges = prev.achievements.map(badge => {
        if (badge.id === 'badge_route_planner' && prev.currentChapterId === 4 && option.isSafe) {
          return { ...badge, unlocked: true };
        }
        if (badge.id === 'badge_info_defender' && prev.currentChapterId === 7 && option.isSafe) {
          return { ...badge, unlocked: true };
        }
        if (badge.id === 'badge_accessible' && prev.currentChapterId === 6 && option.isSafe) {
          return { ...badge, unlocked: true };
        }
        return badge;
      });

      return {
        ...prev,
        score: newScore,
        scoreBreakdown: breakdown,
        chapters: updatedChapters,
        achievements: updatedBadges,
        activeDilemmaTask: null,
        feedbackModal: {
          isOpen: true,
          title: task.dilemma!.title,
          isSafe: option.isSafe,
          feedbackText: option.feedback,
          sourceRef: task.dilemma!.sourceReference,
        },
      };
    });
  };

  // Action: Complete Chapter & Advance
  const completeCurrentChapter = () => {
    soundEngine.playSuccess();
    setState(prev => {
      const nextId = prev.currentChapterId + 1;
      if (nextId >= prev.chapters.length) {
        // Unlocked final badge
        const finalBadges = prev.achievements.map(b => 
          b.id === 'badge_72_complete' ? { ...b, unlocked: true } : b
        );
        return {
          ...prev,
          phase: 'final_report',
          achievements: finalBadges,
          activeModal: null,
        };
      }
      return {
        ...prev,
        currentChapterId: nextId,
        activeModal: 'chapter_dialogue',
      };
    });
  };

  // Action: Layer toggle
  const toggleLayer = (layerKey: keyof GameStoreState['activeLayers']) => {
    soundEngine.playClick();
    setState(prev => {
      const current = prev.activeLayers || {
        floodRisk: true,
        landslideRisk: true,
        closedRoads: true,
        safeRoutes: false,
      };
      return {
        ...prev,
        activeLayers: {
          ...current,
          [layerKey]: !current[layerKey],
        },
      };
    });
  };

  // Action: Reset Game
  const resetGame = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      phase: 'welcome',
      currentChapterId: 0,
      chapters: JSON.parse(JSON.stringify(CHAPTERS_DATA)),
      inspectedBuildingIds: [],
      selectedBuilding: null,
      score: 0,
      scoreBreakdown: {
        riskDetection: 0,
        preparedness: 0,
        safeDecisionMaking: 0,
        communication: 0,
        inclusivePlanning: 0,
      },
      activeDilemmaTask: null,
      packedBagItemIds: [],
      verifiedMessages: {},
      selectedRouteId: null,
      familyChecklist: INITIAL_FAMILY_CHECKLIST,
      achievements: JSON.parse(JSON.stringify(ACHIEVEMENTS)),
      activeLayers: {
        floodRisk: true,
        landslideRisk: true,
        closedRoads: true,
        safeRoutes: false,
      },
      activeModal: null,
      showTeacherMode: false,
      showFamilyChecklist: false,
      showAboutModal: false,
      feedbackModal: null,
    });
  };

  return {
    state,
    setState,
    currentChapter,
    startGame,
    selectBuilding,
    makeDecision,
    completeCurrentChapter,
    toggleLayer,
    resetGame,
  };
}
