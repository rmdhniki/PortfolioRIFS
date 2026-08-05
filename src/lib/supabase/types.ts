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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
