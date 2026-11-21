import axios from 'axios';

const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8002/api/v1";
const axiosClient = axios.create({
  baseURL: backendURL,
  timeout: 8000, // ✅ 8s max timeout
  withCredentials: true
});

export const setAuthToken = (token: string) => {
  if (token) {
    return (axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`);
  } else {
    return delete axiosClient.defaults.headers.common['Authorization'];
  }
};

// ─── Suspended accounts ───────────────────────────────────────────────────────
// The backend answers 403 { code: "ACCOUNT_SUSPENDED" } on any protected call or
// sign-in by a suspended user. Every such response fires one window event, which
// AppContextProvider turns into a sign-out plus the "account suspended" notice.

export const ACCOUNT_SUSPENDED_EVENT = 'proptriz:account-suspended';

export function isAccountSuspendedError(error: unknown): boolean {
  const res = (error as { response?: { status?: number; data?: { code?: string } } })?.response;
  return res?.status === 403 && res.data?.code === 'ACCOUNT_SUSPENDED';
}

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && isAccountSuspendedError(error)) {
      window.dispatchEvent(new Event(ACCOUNT_SUSPENDED_EVENT));
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
