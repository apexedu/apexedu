import { mockSiteData } from "../data/mock";
import type { ApplicationPayload, SiteData } from "../types";

// Servis qatlami. 1-bosqichda mock; 2-bosqichda faqat shu fayl Apps Script URL'ga ulanadi.
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getSiteData(): Promise<SiteData> {
  await delay(300);
  return mockSiteData;
}

export async function submitApplication(payload: ApplicationPayload): Promise<void> {
  await delay(800);
  console.info("[mock] ariza yuborildi:", payload);
}
