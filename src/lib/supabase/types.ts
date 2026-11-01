export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  gradient: string;
  tech: string[];
  year: string;
  industry: string;
  client: string;
  duration: string;
  overview: string;
  problem: string;
  solution: string;
  features: string[];
  gallery: string[];
  github: string | null;
  demo: string | null;
  image_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type StatItem = { label: string; value: number; suffix: string };
export type ServiceItem = { title: string; description: string };
export type SocialLink = { label: string; href: string; icon: string };
export type CertificationItem = {
  id: string;
  title: string;
  description: string;
  credential_id: string;
  verify_url: string | null;
  image_url: string | null;
  /** Published (shown on the site) or hidden. */
  is_visible: boolean;
  order_index: number;
};
export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  /** Legacy free-text period, superseded by start_date/end_date. */
  period: string;
  description: string;
  image_url: string | null;
  /** ISO date (YYYY-MM-DD); only year and month are meaningful. */
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  is_visible: boolean;
  order_index: number;
};

export type SiteSettingsRow = {
  id: number;
  name: string;
  brand: string;
  role: string;
  roles: string[];
  tagline: string;
  email: string;
  location: string;
  available_for_work: boolean;
  about_title: string;
  about_education: string;
  about_description: string;
  stats: StatItem[];
  services: ServiceItem[];
  tech_stack_row1: string[];
  tech_stack_row2: string[];
  social_links: SocialLink[];
  hero_image_url: string | null;
  services_image_url: string | null;
  about_front_image_url: string | null;
  about_back_image_url: string | null;
  lanyard_strap_image_url: string | null;
  cv_url: string | null;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: Omit<ProjectRow, "id" | "created_at" | "updated_at"> &
          Partial<Pick<ProjectRow, "id" | "created_at" | "updated_at">>;
        Update: Partial<Omit<ProjectRow, "id">>;
        Relationships: [];
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: Omit<ContactMessageRow, "id" | "created_at" | "is_read"> &
          Partial<Pick<ContactMessageRow, "id" | "created_at" | "is_read">>;
        Update: Partial<Omit<ContactMessageRow, "id">>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingsRow;
        Insert: Partial<SiteSettingsRow>;
        Update: Partial<SiteSettingsRow>;
        Relationships: [];
      };
      certifications: {
        Row: CertificationItem;
        Insert: Omit<CertificationItem, "id"> & Partial<Pick<CertificationItem, "id">>;
        Update: Partial<Omit<CertificationItem, "id">>;
        Relationships: [];
      };
      experiences: {
        Row: ExperienceItem;
        Insert: Omit<ExperienceItem, "id"> & Partial<Pick<ExperienceItem, "id">>;
        Update: Partial<Omit<ExperienceItem, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
