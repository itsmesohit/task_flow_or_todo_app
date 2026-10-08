export function formatDate(dateString: string): string {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return 'No due date';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const hasTime = dateString.includes('T');
  if (hasTime) {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  return formatDate(dateString);
}

export interface DueDateStatus {
  label: string;
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean;
  colorClass: string;
  bgClass: string;
}

export function getDueDateStatus(dueDateStr: string, completed: boolean): DueDateStatus {
  if (!dueDateStr) {
    return {
      label: 'No due date',
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      colorClass: 'text-slate-500',
      bgClass: 'bg-slate-100',
    };
  }

  if (completed) {
    return {
      label: `Completed (Due ${formatDate(dueDateStr)})`,
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50 border-emerald-200',
    };
  }

  const now = new Date();
  // Strip time for day comparison if due date doesn't specify time
  const isDateOnly = !dueDateStr.includes('T');
  const due = new Date(dueDateStr);
  
  if (isNaN(due.getTime())) {
    return {
      label: dueDateStr,
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      colorClass: 'text-slate-600',
      bgClass: 'bg-slate-100',
    };
  }

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDayStart = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const diffDays = Math.round((dueDayStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

  if (isDateOnly) {
    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return {
        label: `Overdue by ${daysAgo} ${daysAgo === 1 ? 'day' : 'days'}`,
        isOverdue: true,
        isDueToday: false,
        isDueSoon: false,
        colorClass: 'text-rose-700 font-medium',
        bgClass: 'bg-rose-50 border border-rose-200',
      };
    } else if (diffDays === 0) {
      return {
        label: 'Due today',
        isOverdue: false,
        isDueToday: true,
        isDueSoon: true,
        colorClass: 'text-amber-800 font-medium',
        bgClass: 'bg-amber-50 border border-amber-200',
      };
    } else if (diffDays === 1) {
      return {
        label: 'Due tomorrow',
        isOverdue: false,
        isDueToday: false,
        isDueSoon: true,
        colorClass: 'text-amber-700',
        bgClass: 'bg-amber-50/70 border border-amber-200/60',
      };
    } else if (diffDays <= 3) {
      return {
        label: `Due in ${diffDays} days`,
        isOverdue: false,
        isDueToday: false,
        isDueSoon: true,
        colorClass: 'text-blue-700',
        bgClass: 'bg-blue-50 border border-blue-200',
      };
    } else {
      return {
        label: `Due ${formatDate(dueDateStr)}`,
        isOverdue: false,
        isDueToday: false,
        isDueSoon: false,
        colorClass: 'text-slate-600',
        bgClass: 'bg-slate-100 border border-slate-200',
      };
    }
  } else {
    // Exact timestamp comparison
    const diffMs = due.getTime() - now.getTime();
    if (diffMs < 0) {
      return {
        label: `Overdue (${formatDateTime(dueDateStr)})`,
        isOverdue: true,
        isDueToday: false,
        isDueSoon: false,
        colorClass: 'text-rose-700 font-medium',
        bgClass: 'bg-rose-50 border border-rose-200',
      };
    } else if (diffDays === 0) {
      return {
        label: `Due today at ${due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        isOverdue: false,
        isDueToday: true,
        isDueSoon: true,
        colorClass: 'text-amber-800 font-medium',
        bgClass: 'bg-amber-50 border border-amber-200',
      };
    } else {
      return {
        label: `Due ${formatDate(dueDateStr)}`,
        isOverdue: false,
        isDueToday: false,
        isDueSoon: false,
        colorClass: 'text-slate-600',
        bgClass: 'bg-slate-100 border border-slate-200',
      };
    }
  }
}
