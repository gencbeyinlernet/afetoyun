import React, { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { ThreeCanvas } from './game/scene/ThreeCanvas';
import { TopBar } from './components/HUD/TopBar';
import { BottomDock } from './components/HUD/BottomDock';
import { WelcomeScreen } from './components/Screens/WelcomeScreen';
import { ChapterIntroModal } from './components/Dialogs/ChapterIntroModal';
import { DecisionModal } from './components/Dialogs/DecisionModal';
import { FeedbackModal } from './components/Dialogs/FeedbackModal';
import { BagPackerModal } from './components/Dialogs/BagPackerModal';
import { MisinformationModal } from './components/Dialogs/MisinformationModal';
import { RouteEvaluatorModal } from './components/Dialogs/RouteEvaluatorModal';
import { ObjectInfoDrawer } from './components/Dialogs/ObjectInfoDrawer';
import { TeacherModeModal } from './components/Reports/TeacherModeModal';
import { FamilyChecklistModal } from './components/Reports/FamilyChecklistModal';
import { FinalReportModal } from './components/Reports/FinalReportModal';
import { AboutModal } from './components/Dialogs/AboutModal';
import { AuthModal } from './components/Community/AuthModal';
import { CommunityHubModal } from './components/Community/CommunityHubModal';
import { authService, AppUser, leaderboardService } from './services/supabase';
import { ChapterTask } from './types/game';
import { BUILDINGS } from './data/mapData';
import { soundEngine } from './game/audio';

export default function App() {
  const {
    state,
    setState,
    currentChapter,
    startGame,
    selectBuilding,
    makeDecision,
    completeCurrentChapter,
    toggleLayer,
    resetGame,
  } = useGameStore();

  const [activeTaskDilemma, setActiveTaskDilemma] = useState<{ task: ChapterTask } | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => authService.getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [gameStartTime] = useState(Date.now());

  // Automatically sync score to Supabase Leaderboard when score or chapter updates
  useEffect(() => {
    if (currentUser && state.score > 0) {
      const duration = Math.floor((Date.now() - gameStartTime) / 1000);
      const badgesCount = state.achievements.filter(a => a.unlocked).length;
      leaderboardService.saveScore(
        currentUser.username,
        state.score,
        state.currentChapterId,
        duration,
        badgesCount
      );
    }
  }, [state.score, state.currentChapterId, currentUser]);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  // Check if all tasks in current chapter are finished
  const allTasksCompleted = currentChapter.tasks.every(t => t.completed);

  // Action dispatcher when clicking task action button in bottom dock
  const handleOpenTaskAction = (task: ChapterTask) => {
    soundEngine.playClick();
    if (task.actionType === 'decision' && task.dilemma) {
      setActiveTaskDilemma({ task });
    } else if (task.actionType === 'pack_bag') {
      setState(prev => ({ ...prev, activeModal: 'bag_packer' }));
    } else if (task.actionType === 'verify_messages') {
      setState(prev => ({ ...prev, activeModal: 'messages' }));
    } else if (task.actionType === 'evaluate_route') {
      setState(prev => ({ ...prev, activeModal: 'route_evaluator' }));
    } else if (task.actionType === 'inspect_objects') {
      // Focus on first related building if available
      if (task.relatedBuildingIds && task.relatedBuildingIds.length > 0) {
        const targetId = task.relatedBuildingIds.find(id => !state.inspectedBuildingIds.includes(id)) || task.relatedBuildingIds[0];
        const fullBld = BUILDINGS.find(b => b.id === targetId);
        if (fullBld) {
          selectBuilding(fullBld);
        }
      }
    } else if (task.actionType === 'general') {
      // Mark as completed
      setState(prev => {
        const updatedChapters = prev.chapters.map(c => {
          if (c.id === prev.currentChapterId) {
            return {
              ...c,
              tasks: c.tasks.map(t => t.id === task.id ? { ...t, completed: true } : t),
            };
          }
          return c;
        });
        return {
          ...prev,
          chapters: updatedChapters,
          score: Math.min(100, prev.score + 10),
        };
      });
      soundEngine.playSuccess();
    }
  };

  // Complete bag packing
  const handleConfirmBag = (packedItemIds: string[]) => {
    setState(prev => {
      const updatedChapters = prev.chapters.map(c => {
        if (c.id === prev.currentChapterId) {
          return {
            ...c,
            tasks: c.tasks.map(t => t.actionType === 'pack_bag' ? { ...t, completed: true } : t),
          };
        }
        return c;
      });

      const updatedBadges = prev.achievements.map(b => 
        b.id === 'badge_prep_master' ? { ...b, unlocked: true } : b
      );

      return {
        ...prev,
        packedBagItemIds: packedItemIds,
        score: Math.min(100, prev.score + 20),
        scoreBreakdown: {
          ...prev.scoreBreakdown,
          preparedness: Math.min(25, prev.scoreBreakdown.preparedness + 20),
        },
        chapters: updatedChapters,
        achievements: updatedBadges,
        activeModal: null,
      };
    });
  };

  // Complete message verification
  const handleCompleteMessages = (scoreGained: number) => {
    setState(prev => {
      const updatedChapters = prev.chapters.map(c => {
        if (c.id === prev.currentChapterId) {
          return {
            ...c,
            tasks: c.tasks.map(t => t.actionType === 'verify_messages' ? { ...t, completed: true } : t),
          };
        }
        return c;
      });

      return {
        ...prev,
        score: Math.min(100, prev.score + scoreGained),
        scoreBreakdown: {
          ...prev.scoreBreakdown,
          communication: Math.min(15, prev.scoreBreakdown.communication + scoreGained),
        },
        chapters: updatedChapters,
        activeModal: null,
      };
    });
  };

  // Complete route evaluation
  const handleSelectSafeRoute = () => {
    setState(prev => {
      const updatedChapters = prev.chapters.map(c => {
        if (c.id === prev.currentChapterId) {
          return {
            ...c,
            tasks: c.tasks.map(t => t.actionType === 'evaluate_route' ? { ...t, completed: true } : t),
          };
        }
        return c;
      });

      const updatedBadges = prev.achievements.map(b => 
        b.id === 'badge_route_planner' ? { ...b, unlocked: true } : b
      );

      return {
        ...prev,
        selectedRouteId: 'B',
        activeLayers: {
          ...prev.activeLayers,
          safeRoutes: true,
        },
        score: Math.min(100, prev.score + 15),
        scoreBreakdown: {
          ...prev.scoreBreakdown,
          safeDecisionMaking: Math.min(30, prev.scoreBreakdown.safeDecisionMaking + 15),
        },
        chapters: updatedChapters,
        achievements: updatedBadges,
        activeModal: null,
      };
    });
  };

  // Toggle family checklist item
  const handleToggleChecklistItem = (id: string) => {
    setState(prev => ({
      ...prev,
      familyChecklist: prev.familyChecklist.map(it => 
        it.id === id ? { ...it, completed: !it.completed } : it
      ),
    }));
  };

  // Jump to chapter (for Teacher mode)
  const handleJumpToChapter = (chapterId: number) => {
    setState(prev => ({
      ...prev,
      currentChapterId: chapterId,
      phase: 'playing',
      activeModal: 'chapter_dialogue',
    }));
  };

  if (state.phase === 'welcome') {
    return (
      <div className="w-screen h-screen overflow-hidden">
        <WelcomeScreen
          currentUser={currentUser}
          onOpenCommunity={() => setShowCommunityModal(true)}
          onStartGame={startGame}
          onOpenTeacherMode={() => setState(prev => ({ ...prev, showTeacherMode: true }))}
          onOpenFamilyChecklist={() => setState(prev => ({ ...prev, showFamilyChecklist: true }))}
          onOpenAbout={() => setState(prev => ({ ...prev, showAboutModal: true }))}
        />

        {showCommunityModal && (
          <CommunityHubModal
            currentUser={currentUser}
            onOpenAuth={() => setShowAuthModal(true)}
            onLogout={handleLogout}
            onClose={() => setShowCommunityModal(false)}
          />
        )}

        {showAuthModal && (
          <AuthModal
            onSuccess={(usr) => {
              setCurrentUser(usr);
              setShowAuthModal(false);
            }}
            onClose={() => setShowAuthModal(false)}
          />
        )}

        {state.showTeacherMode && (
          <TeacherModeModal
            currentChapterId={state.currentChapterId}
            onJumpToChapter={handleJumpToChapter}
            onResetGame={resetGame}
            onClose={() => setState(prev => ({ ...prev, showTeacherMode: false }))}
          />
        )}

        {state.showFamilyChecklist && (
          <FamilyChecklistModal
            checklist={state.familyChecklist}
            onToggleItem={handleToggleChecklistItem}
            onClose={() => setState(prev => ({ ...prev, showFamilyChecklist: false }))}
          />
        )}

        {state.showAboutModal && (
          <AboutModal onClose={() => setState(prev => ({ ...prev, showAboutModal: false }))} />
        )}
      </div>
    );
  }

  return (
    <main className="w-screen h-screen relative bg-slate-950 overflow-hidden font-sans select-none">
      
      {/* 3D WebGL Canvas Viewport */}
      <ThreeCanvas
        weather={currentChapter.weather}
        riverLevel={currentChapter.riverLevel}
        selectedBuildingId={state.selectedBuilding?.id || null}
        activeLayers={state.activeLayers || { floodRisk: true, landslideRisk: true, closedRoads: true, safeRoutes: false }}
        onSelectBuilding={selectBuilding}
      />

      {/* Top HUD Bar with User & Community Access */}
      <TopBar
        chapterTitle={currentChapter.title}
        simulatedTime={currentChapter.simulatedTime}
        meteoWarning={currentChapter.meteoWarning}
        score={state.score}
        currentUser={currentUser}
        onOpenCommunity={() => setShowCommunityModal(true)}
        onOpenTeacherMode={() => setState(prev => ({ ...prev, showTeacherMode: true }))}
        onOpenFamilyChecklist={() => setState(prev => ({ ...prev, showFamilyChecklist: true }))}
        onOpenAbout={() => setState(prev => ({ ...prev, showAboutModal: true }))}
      />

      {/* Collapsible Unified Bottom Dock */}
      <BottomDock
        tasks={currentChapter.tasks}
        allTasksCompleted={allTasksCompleted}
        activeLayers={state.activeLayers || { floodRisk: true, landslideRisk: true, closedRoads: true, safeRoutes: false }}
        onToggleLayer={toggleLayer}
        onOpenTaskAction={handleOpenTaskAction}
        onCompleteChapter={completeCurrentChapter}
      />

      {/* Slide-over Object Info Drawer when clicking on building */}
      {state.selectedBuilding && (
        <ObjectInfoDrawer
          building={state.selectedBuilding}
          isInspected={state.inspectedBuildingIds.includes(state.selectedBuilding.id)}
          onClose={() => setState(prev => ({ ...prev, selectedBuilding: null }))}
        />
      )}

      {/* Chapter Intro Dialogue Modal */}
      {state.activeModal === 'chapter_dialogue' && (
        <ChapterIntroModal
          chapter={currentChapter}
          onClose={() => setState(prev => ({ ...prev, activeModal: null }))}
        />
      )}

      {/* Decision Dilemma Modal */}
      {activeTaskDilemma && activeTaskDilemma.task.dilemma && (
        <DecisionModal
          dilemma={activeTaskDilemma.task.dilemma}
          taskId={activeTaskDilemma.task.id}
          onMakeDecision={(taskId, choiceId) => {
            makeDecision(taskId, choiceId);
            setActiveTaskDilemma(null);
          }}
          onClose={() => setActiveTaskDilemma(null)}
        />
      )}

      {/* Pedagogical Feedback Modal */}
      {state.feedbackModal && (
        <FeedbackModal
          isOpen={state.feedbackModal.isOpen}
          title={state.feedbackModal.title}
          isSafe={state.feedbackModal.isSafe}
          feedbackText={state.feedbackModal.feedbackText}
          sourceRef={state.feedbackModal.sourceRef}
          onClose={() => setState(prev => ({ ...prev, feedbackModal: null }))}
        />
      )}

      {/* Chapter 2 Bag Packer Modal */}
      {state.activeModal === 'bag_packer' && (
        <BagPackerModal
          initialPackedIds={state.packedBagItemIds}
          onConfirmBag={handleConfirmBag}
          onClose={() => setState(prev => ({ ...prev, activeModal: null }))}
        />
      )}

      {/* Message Verification Modal */}
      {state.activeModal === 'messages' && (
        <MisinformationModal
          onComplete={handleCompleteMessages}
          onClose={() => setState(prev => ({ ...prev, activeModal: null }))}
        />
      )}

      {/* Route Evaluator Modal */}
      {state.activeModal === 'route_evaluator' && (
        <RouteEvaluatorModal
          onSelectSafeRoute={handleSelectSafeRoute}
          onClose={() => setState(prev => ({ ...prev, activeModal: null }))}
        />
      )}

      {/* Community, Leaderboard, Admin & Chat Hub */}
      {showCommunityModal && (
        <CommunityHubModal
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onClose={() => setShowCommunityModal(false)}
        />
      )}

      {/* Login & Register Modal */}
      {showAuthModal && (
        <AuthModal
          onSuccess={(usr) => {
            setCurrentUser(usr);
            setShowAuthModal(false);
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Teacher Mode Modal */}
      {state.showTeacherMode && (
        <TeacherModeModal
          currentChapterId={state.currentChapterId}
          onJumpToChapter={handleJumpToChapter}
          onResetGame={resetGame}
          onClose={() => setState(prev => ({ ...prev, showTeacherMode: false }))}
        />
      )}

      {/* Family Checklist Modal */}
      {state.showFamilyChecklist && (
        <FamilyChecklistModal
          checklist={state.familyChecklist}
          onToggleItem={handleToggleChecklistItem}
          onClose={() => setState(prev => ({ ...prev, showFamilyChecklist: false }))}
        />
      )}

      {/* About Modal */}
      {state.showAboutModal && (
        <AboutModal onClose={() => setState(prev => ({ ...prev, showAboutModal: false }))} />
      )}

      {/* Final 72-Hour Report Modal */}
      {state.phase === 'final_report' && (
        <FinalReportModal
          score={state.score}
          scoreBreakdown={state.scoreBreakdown}
          achievements={state.achievements}
          onOpenChecklist={() => setState(prev => ({ ...prev, showFamilyChecklist: true }))}
          onRestart={resetGame}
        />
      )}

    </main>
  );
}
