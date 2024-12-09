'use client'

// Inspired by react-hot-toast library
import * as React from 'react'

import type {
  ToastActionElement,
  ToastProps,
} from "@/registry/default/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 4000
const ANIMATION_DURATION = 200

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string, duration: number) => {
  if (toastTimeouts.has(toastId)) {
    clearTimeout(toastTimeouts.get(toastId));
    toastTimeouts.delete(toastId);
  }

  const timeout = setTimeout(() => {
    dispatch({ type: 'DISMISS_TOAST', toastId });

    setTimeout(() => {
      dispatch({ type: 'REMOVE_TOAST', toastId });
    }, ANIMATION_DURATION);

    toastTimeouts.delete(toastId);
  }, duration);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map(t => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId, TOAST_REMOVE_DELAY);
      } else {
        state.toasts.forEach(toast => {
          addToRemoveQueue(toast.id, TOAST_REMOVE_DELAY);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach(listener => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, 'id'>;

function toast({ duration = TOAST_REMOVE_DELAY, ...props }: Toast) {
  const id = genId();

  const clearExisting = () => {
    return new Promise<void>(resolve => {
      const existingToasts = [...memoryState.toasts];
      if (existingToasts.length) {
        existingToasts.forEach(t => {
          if (toastTimeouts.has(t.id)) {
            clearTimeout(toastTimeouts.get(t.id));
            toastTimeouts.delete(t.id);
          }
        });
        dispatch({ type: 'DISMISS_TOAST' });

        setTimeout(() => {
          dispatch({ type: 'REMOVE_TOAST' });
          resolve();
        }, ANIMATION_DURATION);
      } else {
        resolve();
      }
    });
  };

  const showToast = () => {
    dispatch({
      type: 'ADD_TOAST',
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: open => {
          if (!open) {
            dispatch({ type: 'DISMISS_TOAST', toastId: id });
            setTimeout(() => {
              dispatch({ type: 'REMOVE_TOAST', toastId: id });
            }, ANIMATION_DURATION);
          }
        },
      },
    });

    if (duration) {
      addToRemoveQueue(id, duration);
    }
  };

  clearExisting().then(() => {
    setTimeout(showToast, 50);
  });

  return {
    id,
    dismiss: () => dispatch({ type: 'DISMISS_TOAST', toastId: id }),
    update: (props: ToasterToast) =>
      dispatch({
        type: 'UPDATE_TOAST',
        toast: { ...props, id },
      }),
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };
