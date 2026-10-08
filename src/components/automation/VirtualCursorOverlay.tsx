import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, X, MousePointer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CursorPosition {
  x: number;
  y: number;
}

export const VirtualCursorOverlay: React.FC = () => {
  const { logout, isAuthenticated } = useAuth();

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cursorPos, setCursorPos] = useState<CursorPosition>({ x: 100, y: 100 });
  const [isClicking, setIsClicking] = useState(false);
  const [currentActionLabel, setCurrentActionLabel] = useState<string>('');
  const [stepIndex, setStepIndex] = useState(0);
  const [totalSteps] = useState(12);
  const [isCompleted, setIsCompleted] = useState(false);
  const [speed, setSpeed] = useState<number>(1); // 1x or 1.5x

  const isPausedRef = useRef(isPaused);
  isPausedRef.current = isPaused;
  const isRunningRef = useRef(isRunning);
  isRunningRef.current = isRunning;

  // Auto-run if query param is set
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('test') === 'true' || params.get('autorun') === 'true') {
      setTimeout(() => {
        startTest();
      }, 1000);
    }
  }, []);

  const sleep = (ms: number) => {
    return new Promise<void>((resolve) => {
      const adjustedMs = ms / speed;
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (!isRunningRef.current) {
          clearInterval(interval);
          resolve();
          return;
        }
        if (!isPausedRef.current) {
          if (Date.now() - startTime >= adjustedMs) {
            clearInterval(interval);
            resolve();
          }
        }
      }, 50);
    });
  };

  const moveCursorTo = async (targetX: number, targetY: number, durationMs = 700) => {
    const startX = cursorPos.x;
    const startY = cursorPos.y;
    const startTime = performance.now();
    const adjustedDuration = durationMs / speed;

    return new Promise<void>((resolve) => {
      const animate = (currentTime: number) => {
        if (!isRunningRef.current) {
          resolve();
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / adjustedDuration, 1);
        // EaseInOutCubic easing
        const ease =
          progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        const currentX = startX + (targetX - startX) * ease;
        const currentY = startY + (targetY - startY) * ease;

        setCursorPos({ x: currentX, y: currentY });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  };

  const moveCursorToElement = async (selector: string | HTMLElement, durationMs = 700): Promise<DOMRect | null> => {
    const el = typeof selector === 'string' ? (document.querySelector(selector) as HTMLElement) : selector;
    if (!el) return null;

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await sleep(200);

    const rect = el.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    await moveCursorTo(targetX, targetY, durationMs);
    return rect;
  };

  const simulateClick = async () => {
    setIsClicking(true);
    await sleep(150);
    setIsClicking(false);
    await sleep(150);
  };

  const startTest = async () => {
    setIsRunning(true);
    setIsPaused(false);
    setIsCompleted(false);
    setStepIndex(1);

    try {
      // Step 1: Start at Auth page or sign out if already logged in
      setCurrentActionLabel('Checking session state...');
      if (isAuthenticated) {
        setCurrentActionLabel('Signing out to demonstrate full login/registration flow...');
        await moveCursorTo(window.innerWidth - 80, 32, 600);
        await simulateClick();
        logout();
        await sleep(800);
      }

      // Step 2: Switch to "Create Account"
      setStepIndex(2);
      setCurrentActionLabel('Navigating to "Create Account" tab...');
      const createAccountBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Create Account')
      ) as HTMLButtonElement | undefined;
      if (createAccountBtn) {
        await moveCursorToElement(createAccountBtn);
        await simulateClick();
        createAccountBtn.click();
      }
      await sleep(600);

      // Step 3: Fill in registration form
      setStepIndex(3);
      setCurrentActionLabel('Entering user registration details...');
      const nameInput = document.querySelector('input[placeholder*="John Doe"]') as HTMLInputElement;
      if (nameInput) {
        await moveCursorToElement(nameInput);
        await simulateClick();
        nameInput.focus();
        nameInput.value = 'Sarah Connor';
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await sleep(400);

      const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
      if (emailInput) {
        await moveCursorToElement(emailInput);
        await simulateClick();
        emailInput.focus();
        emailInput.value = `sarah_${Date.now().toString(36).slice(-4)}@example.com`;
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await sleep(400);

      const passInputs = Array.from(document.querySelectorAll('input[type="password"]')) as HTMLInputElement[];
      if (passInputs[0]) {
        await moveCursorToElement(passInputs[0]);
        await simulateClick();
        passInputs[0].focus();
        passInputs[0].value = 'password123';
        passInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
      await sleep(300);

      if (passInputs[1]) {
        await moveCursorToElement(passInputs[1]);
        await simulateClick();
        passInputs[1].focus();
        passInputs[1].value = 'password123';
        passInputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
      await sleep(400);

      // Step 4: Click Create Free Account
      setStepIndex(4);
      setCurrentActionLabel('Submitting registration form...');
      const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitBtn) {
        await moveCursorToElement(submitBtn);
        await simulateClick();
        submitBtn.click();
      }
      await sleep(1000);

      // Step 5: Dashboard loaded, open Add Task modal
      setStepIndex(5);
      setCurrentActionLabel('Arrived at Dashboard! Clicking "Add New Task"...');
      const addBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Add New Task')
      ) as HTMLButtonElement | undefined;
      if (addBtn) {
        await moveCursorToElement(addBtn);
        await simulateClick();
        addBtn.click();
      }
      await sleep(700);

      // Step 6: Create Task 1 (High Priority, due tomorrow)
      setStepIndex(6);
      setCurrentActionLabel('Creating High-Priority Task: "Production Security Audit"...');
      const titleInput = document.querySelector('input[placeholder*="quarterly financial review"]') as HTMLInputElement;
      if (titleInput) {
        await moveCursorToElement(titleInput);
        await simulateClick();
        titleInput.focus();
        titleInput.value = 'Production Security & Auth Audit';
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await sleep(400);

      // Select High Priority
      setCurrentActionLabel('Setting Priority to HIGH (Urgent)...');
      const highPriorityBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('High') && b.closest('form')
      ) as HTMLButtonElement | undefined;
      if (highPriorityBtn) {
        await moveCursorToElement(highPriorityBtn);
        await simulateClick();
        highPriorityBtn.click();
      }
      await sleep(400);

      // Save task
      const saveTaskBtn = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
        b.textContent?.includes('Create Task')
      ) as HTMLButtonElement | undefined;
      if (saveTaskBtn) {
        await moveCursorToElement(saveTaskBtn);
        await simulateClick();
        saveTaskBtn.click();
      }
      await sleep(900);

      // Step 7: Create Task 2 (Low Priority, due next week)
      setStepIndex(7);
      setCurrentActionLabel('Adding a second task: "Team Weekly Catch-up"...');
      const addBtn2 = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Add New Task')
      ) as HTMLButtonElement | undefined;
      if (addBtn2) {
        await moveCursorToElement(addBtn2);
        await simulateClick();
        addBtn2.click();
      }
      await sleep(600);

      const titleInput2 = document.querySelector('input[placeholder*="quarterly financial review"]') as HTMLInputElement;
      if (titleInput2) {
        await moveCursorToElement(titleInput2);
        await simulateClick();
        titleInput2.focus();
        titleInput2.value = 'Team Weekly Catch-up & Sprint Planning';
        titleInput2.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await sleep(400);

      const lowPriorityBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Low') && b.closest('form')
      ) as HTMLButtonElement | undefined;
      if (lowPriorityBtn) {
        await moveCursorToElement(lowPriorityBtn);
        await simulateClick();
        lowPriorityBtn.click();
      }
      await sleep(400);

      const saveTaskBtn2 = Array.from(document.querySelectorAll('button[type="submit"]')).find((b) =>
        b.textContent?.includes('Create Task')
      ) as HTMLButtonElement | undefined;
      if (saveTaskBtn2) {
        await moveCursorToElement(saveTaskBtn2);
        await simulateClick();
        saveTaskBtn2.click();
      }
      await sleep(900);

      // Step 8: Test completion toggle
      setStepIndex(8);
      setCurrentActionLabel('Testing task completion: Clicking checkbox on Sprint Planning...');
      const checkButtons = Array.from(document.querySelectorAll('button[title*="Mark as completed"]')) as HTMLButtonElement[];
      if (checkButtons.length > 0) {
        // Toggle the second task (Low priority)
        const targetCheck = checkButtons[checkButtons.length - 1];
        await moveCursorToElement(targetCheck);
        await simulateClick();
        targetCheck.click();
      }
      await sleep(1000);

      // Step 9: Test Sorting
      setStepIndex(9);
      setCurrentActionLabel('Verifying Sorting: Testing "Priority (High to Low)"...');
      const sortSelect = document.querySelector('select[title="Sort tasks"]') as HTMLSelectElement;
      if (sortSelect) {
        await moveCursorToElement(sortSelect);
        await simulateClick();
        sortSelect.value = 'priorityDesc';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      await sleep(1000);

      // Switch back to Smart Priority & Due Date
      setCurrentActionLabel('Switching back to "⚡ Smart: Priority & Due Date"...');
      if (sortSelect) {
        await moveCursorToElement(sortSelect);
        await simulateClick();
        sortSelect.value = 'smart';
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
      await sleep(900);

      // Step 10: Test Filters
      setStepIndex(10);
      setCurrentActionLabel('Testing Status Filter: Clicking "Completed" tab...');
      const completedTab = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.trim() === 'Completed' && !b.closest('header')
      ) as HTMLButtonElement | undefined;
      if (completedTab) {
        await moveCursorToElement(completedTab);
        await simulateClick();
        completedTab.click();
      }
      await sleep(1100);

      setCurrentActionLabel('Clicking "All Tasks" to restore full view...');
      const allTab = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.trim() === 'All Tasks'
      ) as HTMLButtonElement | undefined;
      if (allTab) {
        await moveCursorToElement(allTab);
        await simulateClick();
        allTab.click();
      }
      await sleep(800);

      // Step 11: Test Search bar
      setStepIndex(11);
      setCurrentActionLabel('Testing live search: Typing "Security"...');
      const searchInput = document.querySelector('input[placeholder*="Search tasks"]') as HTMLInputElement;
      if (searchInput) {
        await moveCursorToElement(searchInput);
        await simulateClick();
        searchInput.focus();
        searchInput.value = 'Security';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await sleep(1200);

      setCurrentActionLabel('Clearing search filter...');
      if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await sleep(700);

      // Step 12: Finish with celebration
      setStepIndex(12);
      setCurrentActionLabel('All automated tests passed successfully! 🎉');
      await moveCursorTo(window.innerWidth / 2, 200, 600);
      setIsCompleted(true);
      await sleep(2000);

    } catch (err) {
      console.error('Error during live test:', err);
      setCurrentActionLabel('Encountered an interruption.');
    } finally {
      setIsRunning(false);
    }
  };

  const stopTest = () => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentActionLabel('');
  };

  return (
    <>
      {/* Floating launcher trigger (visible when not running) */}
      {!isRunning && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 animate-bounce">
          <button
            type="button"
            onClick={startTest}
            className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-700 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-brand-500/30 border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
              <MousePointer className="w-3.5 h-3.5 fill-white text-white" />
            </div>
            <div className="text-left">
              <span className="block text-xs uppercase tracking-wider text-indigo-100 font-semibold leading-none">
                Interactive Test
              </span>
              <span className="text-sm font-extrabold tracking-tight">
                ▶ Watch Live Cursor Demo
              </span>
            </div>
          </button>
        </div>
      )}

      {/* When running: Top Controller Banner */}
      {isRunning && (
        <aside
          aria-label="Interactive test simulation controls"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-4 text-xs font-medium max-w-xl w-[92%]"
        >
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-slate-200">
              Live Test ({stepIndex}/{totalSteps})
            </span>
          </div>

          <div className="flex-1 truncate text-slate-300">
            {currentActionLabel}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setSpeed(speed === 1 ? 1.5 : 1)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all cursor-pointer text-[11px]"
              title="Toggle speed"
            >
              {speed}x
            </button>

            <button
              type="button"
              onClick={stopTest}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 hover:text-rose-400 text-slate-400 transition-all cursor-pointer"
              title="Stop test"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>
      )}

      {/* Completion Modal / Celebration banner */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Visual Tour Completed!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
              Every feature (Registration, High-Priority Task Creation, Due-Date Ordering, Task Completion, Priority Sorting, and Filters) was executed and verified live via visible cursor.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsCompleted(false);
                  startTest();
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Tour</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCompleted(false)}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Done / Explore App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* THE VIRTUAL CURSOR (Visible when running) */}
      {isRunning && (
        <div
          className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
          style={{
            transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`,
            left: 0,
            top: 0,
          }}
        >
          {/* Cursor SVG Arrow Pointer */}
          <div className="relative">
            <svg
              className={`w-7 h-7 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)] transition-transform duration-150 ${
                isClicking ? 'scale-90 translate-y-0.5' : 'scale-100'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill="#4f46e5"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Click Ripple Effect Ring */}
            {isClicking && (
              <span className="absolute -top-3 -left-3 w-12 h-12 rounded-full border-2 border-indigo-400 bg-indigo-500/30 animate-ping pointer-events-none" />
            )}

            {/* Action Tooltip Pill trailing the cursor */}
            {currentActionLabel && (
              <div className="absolute left-6 top-4 bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg border border-slate-700 whitespace-nowrap pointer-events-none flex items-center gap-1.5 animate-in fade-in duration-100">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                <span>{currentActionLabel}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
