export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          role: UserRole
          employee_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          role?: UserRole
          employee_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['user_profiles']['Insert']>
      }
      employees: {
        Row: {
          id: string
          name: string
          role: EmployeeRole
          region: EmployeeRegion
          phone: string | null
          email: string | null
          address: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: EmployeeRole
          region: EmployeeRegion
          phone?: string | null
          email?: string | null
          address?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['employees']['Insert']>
      }
      packages: {
        Row: {
          id: string
          name: string
          base_price: number | null
          is_system: boolean
          monthly_video_count: number | null
          posts_per_week: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          base_price?: number | null
          is_system?: boolean
          monthly_video_count?: number | null
          posts_per_week?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['packages']['Insert']>
      }
      package_blocks: {
        Row: {
          id: string
          package_id: string
          block_type: string
          duration_minutes: number
          repeat_frequency: RepeatFrequency
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          package_id: string
          block_type: string
          duration_minutes: number
          repeat_frequency: RepeatFrequency
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['package_blocks']['Insert']>
      }
      inventory_packages: {
        Row: {
          id: string
          name: string
          cars_per_hour: number | null
          cars_per_hour_video: number | null
          photos_per_car: number | null
          includes_video_default: boolean
          video_style_default: InventoryVideoStyle | null
          price_per_car: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          cars_per_hour?: number | null
          cars_per_hour_video?: number | null
          photos_per_car?: number | null
          includes_video_default?: boolean
          video_style_default?: InventoryVideoStyle | null
          price_per_car?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['inventory_packages']['Insert']>
      }
      clients: {
        Row: {
          id: string
          name: string
          package_id: string | null
          status: ClientStatus
          monthly_value: number | null
          filming_cadence: FilmingCadence | null
          location: string | null
          state: string | null
          address: string | null
          dealer_group: string | null
          account_health: AccountHealth
          content_notes: string | null
          add_ons: string[]
          monthly_google_reviews: number | null
          brand_pack: string | null
          cycle_start_date: string | null
          service_agreement_date: string | null
          onboarding_progress: Json
          filming_guide: string | null
          editing_guide: string | null
          carbee_enabled: boolean
          carbee_model: CarbeeModel | null
          carbee_cars_per_session: number | null
          carbee_session_duration_minutes: number | null
          carbee_target_cars: number | null
          carbee_stock_percentage: number | null
          carbee_total_stock: number | null
          carbee_monthly_turnover: number | null
          carbee_google_sheet_link: string | null
          carbee_notes: string | null
          carbee_sessions_per_week: number
          carbee_session_schedule: Json
          inventory_enabled: boolean
          inventory_includes_video: boolean
          inventory_video_style: InventoryVideoStyle | null
          inventory_cars_per_hour_photos: number | null
          inventory_cars_per_hour_video: number | null
          inventory_cars_per_session: number | null
          inventory_session_duration_minutes: number | null
          inventory_upload_destination: string | null
          inventory_google_sheet_link: string | null
          inventory_notes: string | null
          inventory_shot_list: string | null
          inventory_positioning_instructions: string | null
          inventory_photos_per_car: number | null
          inventory_specific_angles: string | null
          inventory_example_photos: string[]
          inventory_extra_notes: string | null
          inventory_sessions_per_week: number
          inventory_session_schedule: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          package_id?: string | null
          status?: ClientStatus
          monthly_value?: number | null
          filming_cadence?: FilmingCadence | null
          location?: string | null
          state?: string | null
          address?: string | null
          dealer_group?: string | null
          account_health?: AccountHealth
          content_notes?: string | null
          add_ons?: string[]
          monthly_google_reviews?: number | null
          brand_pack?: string | null
          cycle_start_date?: string | null
          service_agreement_date?: string | null
          onboarding_progress?: Json
          filming_guide?: string | null
          editing_guide?: string | null
          carbee_enabled?: boolean
          carbee_model?: CarbeeModel | null
          carbee_cars_per_session?: number | null
          carbee_session_duration_minutes?: number | null
          carbee_target_cars?: number | null
          carbee_stock_percentage?: number | null
          carbee_total_stock?: number | null
          carbee_monthly_turnover?: number | null
          carbee_google_sheet_link?: string | null
          carbee_notes?: string | null
          carbee_sessions_per_week?: number
          carbee_session_schedule?: Json
          inventory_enabled?: boolean
          inventory_includes_video?: boolean
          inventory_video_style?: InventoryVideoStyle | null
          inventory_cars_per_hour_photos?: number | null
          inventory_cars_per_hour_video?: number | null
          inventory_cars_per_session?: number | null
          inventory_session_duration_minutes?: number | null
          inventory_upload_destination?: string | null
          inventory_google_sheet_link?: string | null
          inventory_notes?: string | null
          inventory_shot_list?: string | null
          inventory_positioning_instructions?: string | null
          inventory_photos_per_car?: number | null
          inventory_specific_angles?: string | null
          inventory_example_photos?: string[]
          inventory_extra_notes?: string | null
          inventory_sessions_per_week?: number
          inventory_session_schedule?: Json
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['clients']['Insert']>
      }
      contacts: {
        Row: {
          id: string
          client_id: string
          full_name: string
          position: string | null
          phone: string | null
          email: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          full_name: string
          position?: string | null
          phone?: string | null
          email?: string | null
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>
      }
      block_rules: {
        Row: {
          id: string
          client_id: string
          block_type: string
          role: string | null
          employee_id: string | null
          duration_minutes: number
          day_of_week: DayOfWeek
          start_time: string
          repeat_frequency: RepeatFrequency
          rule_start_date: string
          rule_end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          block_type: string
          role?: string | null
          employee_id?: string | null
          duration_minutes: number
          day_of_week: DayOfWeek
          start_time: string
          repeat_frequency: RepeatFrequency
          rule_start_date: string
          rule_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['block_rules']['Insert']>
      }
      block_exceptions: {
        Row: {
          id: string
          client_id: string
          block_rule_id: string
          block_type: string | null
          original_date: string
          new_date: string | null
          new_start_time: string | null
          new_employee_id: string | null
          is_cancelled: boolean
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          block_rule_id: string
          block_type?: string | null
          original_date: string
          new_date?: string | null
          new_start_time?: string | null
          new_employee_id?: string | null
          is_cancelled?: boolean
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['block_exceptions']['Insert']>
      }
      client_block_assignments: {
        Row: {
          id: string
          client_id: string
          block_type: string
          employee_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          block_type: string
          employee_id: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['client_block_assignments']['Insert']>
      }
      planning_meetings: {
        Row: {
          id: string
          client_id: string
          month: string
          meeting_date: string | null
          status: PlanningMeetingStatus
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          month: string
          meeting_date?: string | null
          status?: PlanningMeetingStatus
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['planning_meetings']['Insert']>
      }
      content_items: {
        Row: {
          id: string
          title: string
          client_id: string
          planning_meeting_id: string | null
          content_type: ContentType
          format: ContentFormat | null
          template_tag: string | null
          status: ContentStatus
          scheduled_date: string | null
          drive_folder_link: string | null
          caption: string | null
          brief: string | null
          editing_notes: string | null
          platform_override: string | null
          video_example_url: string | null
          video_example_title: string | null
          video_example_notes: string | null
          repeat_enabled: boolean
          repeat_frequency: ContentRepeatFrequency | null
          is_recurring_instance: boolean
          hook_1: string | null
          hook_2: string | null
          hook_3: string | null
          ad_script: string | null
          ad_audience: string | null
          ad_budget: number | null
          ad_start_date: string | null
          ad_end_date: string | null
          lead_type: LeadType | null
          form_questions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          client_id: string
          planning_meeting_id?: string | null
          content_type: ContentType
          format?: ContentFormat | null
          template_tag?: string | null
          status?: ContentStatus
          scheduled_date?: string | null
          drive_folder_link?: string | null
          caption?: string | null
          brief?: string | null
          editing_notes?: string | null
          platform_override?: string | null
          video_example_url?: string | null
          video_example_title?: string | null
          video_example_notes?: string | null
          repeat_enabled?: boolean
          repeat_frequency?: ContentRepeatFrequency | null
          is_recurring_instance?: boolean
          hook_1?: string | null
          hook_2?: string | null
          hook_3?: string | null
          ad_script?: string | null
          ad_audience?: string | null
          ad_budget?: number | null
          ad_start_date?: string | null
          ad_end_date?: string | null
          lead_type?: LeadType | null
          form_questions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['content_items']['Insert']>
      }
      content_item_comments: {
        Row: {
          id: string
          content_item_id: string
          author_id: string | null
          text: string
          created_at: string
        }
        Insert: {
          id?: string
          content_item_id: string
          author_id?: string | null
          text: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['content_item_comments']['Insert']>
      }
      content_type_examples: {
        Row: {
          id: string
          content_type: ContentType
          title: string
          video_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content_type: ContentType
          title: string
          video_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['content_type_examples']['Insert']>
      }
      inventory_sessions: {
        Row: {
          id: string
          client_id: string
          session_date: string
          cars_photographed: number | null
          duration_minutes: number | null
          photographer_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          session_date: string
          cars_photographed?: number | null
          duration_minutes?: number | null
          photographer_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['inventory_sessions']['Insert']>
      }
      audit_log: {
        Row: {
          id: string
          actor_id: string | null
          action: AuditAction
          entity_type: string
          entity_id: string
          diff: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          actor_id?: string | null
          action: AuditAction
          entity_type: string
          entity_id: string
          diff?: Json | null
          created_at?: string
        }
        Update: never
      }
    }
    Views: Record<string, never>
    Functions: {
      current_user_role: {
        Args: Record<string, never>
        Returns: UserRole
      }
      is_admin_or_manager: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      employee_role: EmployeeRole
      employee_region: EmployeeRegion
      client_status: ClientStatus
      account_health: AccountHealth
      filming_cadence: FilmingCadence
      carbee_model: CarbeeModel
      inventory_video_style: InventoryVideoStyle
      repeat_frequency: RepeatFrequency
      day_of_week: DayOfWeek
      content_status: ContentStatus
      content_type: ContentType
      content_format: ContentFormat
      content_repeat_frequency: ContentRepeatFrequency
      lead_type: LeadType
      planning_meeting_status: PlanningMeetingStatus
      audit_action: AuditAction
    }
  }
}

// Enum type aliases
export type UserRole = 'admin' | 'manager' | 'content_creator' | 'editor' | 'viewer'
export type EmployeeRole = 'Social Media Manager' | 'Editor' | 'Content Creator' | 'Marketing Manager' | 'Operations Manager' | 'Founder'
export type EmployeeRegion = 'Melbourne' | 'Sydney' | 'Brisbane' | 'Perth' | 'Newcastle'
export type ClientStatus = 'Active' | 'Onboarding' | 'Paused' | 'Churned'
export type AccountHealth = 'Green' | 'Amber' | 'Red'
export type FilmingCadence = 'Weekly' | 'Fortnightly'
export type CarbeeModel = 'Recurring Sessions' | 'Stock Target'
export type InventoryVideoStyle = 'Style 1 Phone Edited On Spot' | 'Style 2 Camera Edited Next Day'
export type RepeatFrequency = 'Weekly' | 'Fortnightly' | 'Monthly Week 0' | 'Monthly Week 1' | 'Monthly' | 'None'
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
export type ContentStatus = 'Planned' | 'Shoot Booked' | 'Filmed' | 'Editing' | 'QC' | 'Ready for Scheduling' | 'Published'
export type ContentType = 'Car of the Week' | 'Car Highlight' | 'Culture Reel' | 'Trendy TikTok Reel' | 'Informative Reel' | 'Reel Support Post' | 'Delivery Post' | 'Reel Support Story' | 'Testimonial Story' | 'Ad'
export type ContentFormat = 'Reel' | 'Post' | 'Story' | 'Ad'
export type ContentRepeatFrequency = '1w' | '2w' | '3w' | '4w'
export type LeadType = 'Lead Form' | 'Landing Page'
export type PlanningMeetingStatus = 'Scheduled' | 'Completed' | 'Cancelled'
export type AuditAction = 'create' | 'update' | 'delete'

// Convenience row types
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Employee = Database['public']['Tables']['employees']['Row']
export type Package = Database['public']['Tables']['packages']['Row']
export type PackageBlock = Database['public']['Tables']['package_blocks']['Row']
export type InventoryPackage = Database['public']['Tables']['inventory_packages']['Row']
export type Client = Database['public']['Tables']['clients']['Row']
export type Contact = Database['public']['Tables']['contacts']['Row']
export type BlockRule = Database['public']['Tables']['block_rules']['Row']
export type BlockException = Database['public']['Tables']['block_exceptions']['Row']
export type ClientBlockAssignment = Database['public']['Tables']['client_block_assignments']['Row']
export type PlanningMeeting = Database['public']['Tables']['planning_meetings']['Row']
export type ContentItem = Database['public']['Tables']['content_items']['Row']
export type ContentItemComment = Database['public']['Tables']['content_item_comments']['Row']
export type ContentTypeExample = Database['public']['Tables']['content_type_examples']['Row']
export type InventorySession = Database['public']['Tables']['inventory_sessions']['Row']
export type AuditLog = Database['public']['Tables']['audit_log']['Row']
