export interface Course { id: string; name: string; description: string }
export interface Group { id: string; courseId: string; name: string; description: string; schedule: string }
export interface Teacher { id: string; fullName: string; position: string; bio: string; photo?: string }
export interface Format { id: string; name: string; description: string }
export interface Advantage { id: string; title: string; text: string }
export interface Testimonial { id: string; name: string; result: string; text: string }
export interface Faq { id: string; question: string; answer: string }
export interface Settings {
  academyName: string;
  heroTitle: string;
  heroText: string;
  phones: string[];
  telegram: string;
  address: string;
  workingHours: string;
  mapUrl: string;
  stats: { value: string; label: string }[];
}
export interface SiteData {
  settings: Settings;
  courses: Course[];
  groups: Group[];
  teachers: Teacher[];
  formats: Format[];
  advantages: Advantage[];
  testimonials: Testimonial[];
  faqs: Faq[];
}
export interface ApplicationPayload {
  fullName: string;
  phone: string;
  courseId: string;
  groupId: string;
  formatId: string;
  age: string;
  comment: string;
  source: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}
