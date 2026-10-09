export interface Course { id: string; name: string; description: string }
export interface HeroCard { id: string; title: string; courseId: string }
export interface Group { id: string; courseId: string; name: string; description: string; schedule: string }
export interface Teacher { id: string; fullName: string; position: string; bio: string; photo?: string }
export interface Format { id: string; name: string; description: string }
export interface Advantage { id: string; title: string; text: string }
export interface Testimonial { id: string; name: string; result: string; text: string }
export interface Review { id: string; name: string; rating: number; text: string; date: string }
export interface ReviewPayload { name: string; rating: number; text: string }
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
  instagram: string;
  facebook: string;
  youtube: string;
  stats: { value: string; label: string }[];
}
export interface SiteData {
  settings: Settings;
  courses: Course[];
  groups: Group[];
  heroCards: HeroCard[];
  teachers: Teacher[];
  formats: Format[];
  advantages: Advantage[];
  testimonials: Testimonial[];
  faqs: Faq[];
  reviews: Review[];
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
