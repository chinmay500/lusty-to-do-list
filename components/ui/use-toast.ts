import * as React from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1
// const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

export const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

// type ActionType = typeof actionTypes

interface State {
  toasts: ToasterToast[]
}

export const toastReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId || action.toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST
      toast: ToasterToast
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST
      toast: Partial<ToasterToast>
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST
      toastId?: ToasterToast["id"]
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST
      toastId?: ToasterToast["id"]
    }

const useToast = () => {
  const [state, dispatch] = React.useReducer(toastReducer, {
    toasts: [],
  })

  return {
    toasts: state.toasts,
    addToast: (toast: Omit<ToasterToast, "id">) => {
      dispatch({
        type: actionTypes.ADD_TOAST,
        toast: {
          ...toast,
          id: Math.random().toString(36).substr(2, 9),
        },
      })
    },
    updateToast: (toast: Partial<ToasterToast>) => {
      dispatch({ type: actionTypes.UPDATE_TOAST, toast })
    },
    dismissToast: (toastId?: string) => {
      dispatch({ type: actionTypes.DISMISS_TOAST, toastId })
    },
    removeToast: (toastId?: string) => {
      dispatch({ type: actionTypes.REMOVE_TOAST, toastId })
    },
  }
}

export { useToast }

