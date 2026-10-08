import type {
ApplicationPayload,
ReviewPayload,
SiteData,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
console.warn("VITE_API_URL topilmadi");
}

async function request<T>(
action: string,
payload?: object
): Promise<T> {
const url = payload
? API_URL
: `${API_URL}?action=${encodeURIComponent(action)}`;

const response = await fetch(url, {
method: payload ? "POST" : "GET",
headers: payload
? {
"Content-Type": "text/plain;charset=utf-8",
}
: undefined,
body: payload
? JSON.stringify({
action,
...payload,
})
: undefined,
});

if (!response.ok) {
throw new Error(`HTTP error: ${response.status}`);
}

const result = await response.json();

if (!result.ok) {
throw new Error(result.error || "Server xatosi");
}

return result.data;
}

export async function getSiteData(): Promise<SiteData> {
return request<SiteData>("public");
}

export async function submitApplication(
payload: ApplicationPayload
): Promise<void> {
await request("submitApplication", payload);
}

export async function submitReview(
payload: ReviewPayload
): Promise<void> {
await request("submitReview", payload);
}
