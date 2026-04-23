import { createContext, useContext, useReducer, ReactNode, useCallback } from "react";
import type { Applicant, NotificationItem, ActivityItem, AppSettings, CurrentUser, ApplicantStatus } from "@/types";
import {
  seedApplicants, seedNotifications, seedActivity,
  defaultSettings, defaultUser,
} from "@/data/mockData";

interface State {
  applicants: Applicant[];
  notifications: NotificationItem[];
  activity: ActivityItem[];
  settings: AppSettings;
  currentUser: CurrentUser;
  isAuthenticated: boolean;
}

type Action =
  | { type: "SIGN_IN"; payload?: Partial<CurrentUser> }
  | { type: "SIGN_OUT" }
  | { type: "ADD_APPLICANT"; applicant: Applicant }
  | { type: "UPDATE_APPLICANT_STATUS"; id: string; status: ApplicantStatus; reason?: string }
  | { type: "ADD_NOTIFICATION"; notification: NotificationItem }
  | { type: "MARK_NOTIFICATIONS_READ" }
  | { type: "ADD_ACTIVITY"; activity: ActivityItem }
  | { type: "UPDATE_SETTINGS"; patch: Partial<AppSettings> }
  | { type: "UPDATE_USER"; patch: Partial<CurrentUser> };

const initialState: State = {
  applicants: seedApplicants,
  notifications: seedNotifications,
  activity: seedActivity,
  settings: defaultSettings,
  currentUser: defaultUser,
  isAuthenticated: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SIGN_IN":
      return { ...state, isAuthenticated: true, currentUser: { ...state.currentUser, ...(action.payload ?? {}) } };
    case "SIGN_OUT":
      return { ...state, isAuthenticated: false };
    case "ADD_APPLICANT":
      return { ...state, applicants: [action.applicant, ...state.applicants] };
    case "UPDATE_APPLICANT_STATUS":
      return {
        ...state,
        applicants: state.applicants.map(a =>
          a.id === action.id ? { ...a, status: action.status, denialReason: action.reason ?? a.denialReason } : a
        ),
      };
    case "ADD_NOTIFICATION":
      return { ...state, notifications: [action.notification, ...state.notifications] };
    case "MARK_NOTIFICATIONS_READ":
      return { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) };
    case "ADD_ACTIVITY":
      return { ...state, activity: [action.activity, ...state.activity] };
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.patch } };
    case "UPDATE_USER":
      return { ...state, currentUser: { ...state.currentUser, ...action.patch } };
    default:
      return state;
  }
}

interface ContextValue extends State {
  signIn: (user?: Partial<CurrentUser>) => void;
  signOut: () => void;
  addApplicant: (a: Applicant) => void;
  updateApplicantStatus: (id: string, status: ApplicantStatus, reason?: string) => void;
  pushNotification: (n: Omit<NotificationItem, "id" | "createdAt" | "read">) => void;
  markNotificationsRead: () => void;
  pushActivity: (a: Omit<ActivityItem, "id" | "createdAt">) => void;
  updateSettings: (p: Partial<AppSettings>) => void;
  updateUser: (p: Partial<CurrentUser>) => void;
  getApplicant: (id: string) => Applicant | undefined;
}

const AppCtx = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const signIn = useCallback((user?: Partial<CurrentUser>) => dispatch({ type: "SIGN_IN", payload: user }), []);
  const signOut = useCallback(() => dispatch({ type: "SIGN_OUT" }), []);
  const addApplicant = useCallback((a: Applicant) => dispatch({ type: "ADD_APPLICANT", applicant: a }), []);
  const updateApplicantStatus = useCallback((id: string, status: ApplicantStatus, reason?: string) =>
    dispatch({ type: "UPDATE_APPLICANT_STATUS", id, status, reason }), []);
  const pushNotification = useCallback((n: Omit<NotificationItem, "id" | "createdAt" | "read">) =>
    dispatch({ type: "ADD_NOTIFICATION", notification: { ...n, id: `n-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, createdAt: new Date().toISOString(), read: false } }), []);
  const markNotificationsRead = useCallback(() => dispatch({ type: "MARK_NOTIFICATIONS_READ" }), []);
  const pushActivity = useCallback((a: Omit<ActivityItem, "id" | "createdAt">) =>
    dispatch({ type: "ADD_ACTIVITY", activity: { ...a, id: `a-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, createdAt: new Date().toISOString() } }), []);
  const updateSettings = useCallback((p: Partial<AppSettings>) => dispatch({ type: "UPDATE_SETTINGS", patch: p }), []);
  const updateUser = useCallback((p: Partial<CurrentUser>) => dispatch({ type: "UPDATE_USER", patch: p }), []);
  const getApplicant = useCallback((id: string) => state.applicants.find(a => a.id === id), [state.applicants]);

  return (
    <AppCtx.Provider value={{
      ...state, signIn, signOut, addApplicant, updateApplicantStatus,
      pushNotification, markNotificationsRead, pushActivity, updateSettings, updateUser, getApplicant,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
