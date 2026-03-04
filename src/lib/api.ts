/**
 * Lightweight API client for HomeOwnership.Api.
 *
 * Base URL is controlled by the VITE_API_URL env variable.
 * In development, set VITE_API_URL in .env.local or use the Vite proxy (see vite.config.ts).
 * In production the React app is served by the .NET host, so /api routes work with no config.
 */

const BASE = import.meta.env.VITE_API_URL ?? '/api';

// ── Types ──────────────────────────────────────────────────────────────────

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface VersionResponse {
  version: string;
  environment: string;
}

export interface AuthRegisterResponse {
  userId: string;
}

export interface AuthLoginResponse {
  token: string;
  userId: string;
}

export interface MeResponse {
  userId: string;
  email: string;
}

export interface ProfileResponse {
  messageBoardUserName: string | null;
  currentMortgageRate: number | null;
  homeOwnersInsuranceMonthly: number | null;
  monthlyTakeHome: number | null;
  currentMortgageBalance: number | null;
}

export interface UpsertProfileRequest {
  messageBoardUserName?: string | null;
  currentMortgageRate?: number | null;
  homeOwnersInsuranceMonthly?: number | null;
  monthlyTakeHome?: number | null;
  currentMortgageBalance?: number | null;
}

export interface BudgetItemDto {
  id: number;
  category: string;
  name: string;
  amount: number;
  notes: string | null;
  sortOrder: number;
}

export interface CreateBudgetItemRequest {
  category: string;
  name: string;
  amount: number;
  notes?: string | null;
  sortOrder?: number;
}

export interface UpdateBudgetItemRequest {
  category: string;
  name: string;
  amount: number;
  notes?: string | null;
  sortOrder?: number;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface DashboardSummaryResponse {
  displayName: string;
  profileUpdatedUtc: string | null;
  currentMortgageRate: number | null;
  homeOwnersInsuranceMonthly: number | null;
  monthlyTakeHome: number | null;
  totalMonthlyExpenses: number;
  remainingThisMonth: number | null;
  isInTheRed: boolean;
  expenseByCategory: CategoryTotal[];
}

export interface MortgageRateItem {
  lender: string;
  apr: number;
  rate: number;
  points: number;
  notes: string | null;
  source: string;
  url: string | null;
}

export interface MortgageRatesResponse {
  asOfUtc: string;
  termYears: number;
  rateType: string;
  items: MortgageRateItem[];
}

export interface ThreadSummaryDto {
  id: number;
  title: string;
  createdUtc: string;
  updatedUtc: string;
  createdByDisplayName: string;
  replyCount: number;
  lastPostUtc: string | null;
}

export interface PostDto {
  id: number;
  body: string;
  createdUtc: string;
  createdByDisplayName: string;
}

export interface ThreadDetailDto {
  id: number;
  title: string;
  createdUtc: string;
  createdByDisplayName: string;
  posts: PostDto[];
}

export interface ConciergeMessageDto {
  role: string;
  content: string;
  createdUtc: string;
}

export interface ConciergeHistoryResponse {
  messages: ConciergeMessageDto[];
}

export interface ConciergeSendResponse {
  reply: string;
  createdUtc: string;
}

// ── Core fetch wrapper ─────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    // ASP.NET Identity returns { errors: ["desc1", "desc2", …] }
    if (body?.errors && Array.isArray(body.errors)) {
      throw new Error(body.errors.join(' '));
    }
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── API surface ────────────────────────────────────────────────────────────

export const api = {
  /** GET /api/health */
  health: () => request<HealthResponse>('/health'),

  /** GET /api/version */
  version: () => request<VersionResponse>('/version'),

  auth: {
    /** POST /api/auth/register */
    register: (email: string, password: string) =>
      request<AuthRegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    /** POST /api/auth/login — stores JWT in localStorage on success */
    login: async (email: string, password: string): Promise<AuthLoginResponse> => {
      const data = await request<AuthLoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('auth_token', data.token);
      return data;
    },

    /** GET /api/auth/me — requires a valid JWT */
    me: () => request<MeResponse>('/auth/me'),

    /** Remove the stored JWT */
    logout: () => localStorage.removeItem('auth_token'),
  },

  profile: {
    /** GET /api/profile */
    get: () => request<ProfileResponse>('/profile'),

    /** PUT /api/profile (upsert) */
    save: (data: UpsertProfileRequest) =>
      request<ProfileResponse>('/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  budget: {
    /** GET /api/budget/items */
    list: () => request<BudgetItemDto[]>('/budget/items'),

    /** POST /api/budget/items */
    create: (data: CreateBudgetItemRequest) =>
      request<BudgetItemDto>('/budget/items', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    /** PUT /api/budget/items/:id */
    update: (id: number, data: UpdateBudgetItemRequest) =>
      request<BudgetItemDto>(`/budget/items/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),

    /** DELETE /api/budget/items/:id */
    remove: (id: number) =>
      request<void>(`/budget/items/${id}`, { method: 'DELETE' }),
  },

  dashboard: {
    /** GET /api/dashboard/summary */
    summary: () => request<DashboardSummaryResponse>('/dashboard/summary'),
  },

  market: {
    /** GET /api/market/mortgage-rates/top */
    topRates: (termYears = 30, rateType = 'fixed', count = 3) =>
      request<MortgageRatesResponse>(
        `/market/mortgage-rates/top?termYears=${termYears}&rateType=${rateType}&count=${count}`
      ),
  },

  community: {
    /** GET /api/community/threads */
    threads: (page = 1, pageSize = 20) =>
      request<ThreadSummaryDto[]>(`/community/threads?page=${page}&pageSize=${pageSize}`),

    /** GET /api/community/threads/:id */
    thread: (id: number) => request<ThreadDetailDto>(`/community/threads/${id}`),

    /** POST /api/community/threads */
    createThread: (title: string, body: string) =>
      request<ThreadSummaryDto>('/community/threads', {
        method: 'POST',
        body: JSON.stringify({ title, body }),
      }),

    /** POST /api/community/threads/:id/posts */
    createPost: (threadId: number, body: string) =>
      request<PostDto>(`/community/threads/${threadId}/posts`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      }),
  },

  concierge: {
    /** GET /api/concierge/history */
    history: (limit = 30) =>
      request<ConciergeHistoryResponse>(`/concierge/history?limit=${limit}`),

    /** POST /api/concierge/send */
    send: (message: string) =>
      request<ConciergeSendResponse>('/concierge/send', {
        method: 'POST',
        body: JSON.stringify({ message }),
      }),

    /** DELETE /api/concierge/history */
    clear: () =>
      request<{ deleted: number }>('/concierge/history', { method: 'DELETE' }),
  },
};
