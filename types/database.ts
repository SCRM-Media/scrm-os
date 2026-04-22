export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          role?: UserRole
          employee_id?: string | null
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          name?: string
          role?: EmployeeRole
          region?: EmployeeRegion
          phone?: string | null
          email?: string | null
          address?: string | null
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          name?: string
          base_price?: number | null
          is_system?: boolean
          monthly_video_count?: number | null
          posts_per_week?: number | null
          updated_at?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          package_id?: string
          block_type?: string
          duration_minutes?: number
          repeat_frequency?: RepeatFrequency
          updated_at?: string
        }
        Relationships: [{ foreignKeyName: 'package_blocks_package_id_fkey'; columns: ['package_id']; referencedRelation: 'packages'; referencedColumns: ['id'] }]
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
        Update: {
          id?: string
          name?: string
          cars_per_hour?: number | null
          cars_per_hour_video?: number | null
          photos_per_car?: number | null
          includes_video_default?: boolean
          video_style_default?: InventoryVideoStyle | null
          price_per_car?: number | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          name?: string
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
          updated_at?: string
        }
        Relationships: [{ foreignKeyName: 'clients_package_id_fkey'; columns: ['package_id']; referencedRelation: 'packages'; referencedColumns: ['id'] }]
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
        Update: {
          id?: string
          client_id?: string
          full_name?: string
          position?: string | null
          phone?: string | null
          email?: string | null
          is_primary?: boolean
          updated_at?: string
        }
        Relationships: [{ foreignKeyName: 'contacts_client_id_fkey'; columns: ['client_id']; referencedRelation: 'clients'; referencedColumns: ['id'] }]
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
        Update: {
          id?: string
          client_id?: string
          block_type?: string
          role?: string | null
          employee_id?: string | null
          duration_minutes?: number
          day_of_week?: DayOfWeek
          start_time?: string
          repeat_frequency?: RepeatFrequency
          rule_start_date?: string
          rule_end_date?: string | null
          updated_at?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          client_id?: string
          block_rule_id?: string
          block_type?: string | null
          original_date?: string
          new_date?: string | null
          new_start_time?: string | null
          new_employee_id?: string | null
          is_cancelled?: boolean
          note?: string | null
          updated_at?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          client_id?: string
          block_type?: string
          employee_id?: string
          updated_at?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          client_id?: string
          month?: string
          meeting_date?: string | null
          status?: PlanningMeetingStatus
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          title?: string
          client_id?: string
          planning_meeting_id?: string | null
          content_type?: ContentType
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
          updated_at?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          content_item_id?: string
          author_id?: string | null
          text?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          content_type?: ContentType
          title?: string
          video_url?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
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
        Update: {
          id?: string
          client_id?: string
          session_date?: string
          cars_photographed?: number | null
          duration_minutes?: number | null
          photographer_id?: string | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: UserRole
      }
      is_admin_or_manager: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: 'admin' | 'manager' | 'content_creator' | 'editor' | 'viewer'
      employee_role: 'Social Media Manager' | 'Editor' | 'Content Creator' | 'Marketing Manager' | 'Operations Manager' | 'Founder'
      employee_region: 'Melbourne' | 'Sydney' | 'Brisbane' | 'Perth' | 'Newcastle'
      client_status: 'Active' | 'Onboarding' | 'Paused' | 'Churned'
      account_health: 'Green' | 'Amber' | 'Red'
      filming_cadence: 'Weekly' | 'Fortnightly'
      carbee_model: 'Recurring Sessions' | 'Stock Target'
      inventory_video_style: 'Style 1 Phone Edited On Spot' | 'Style 2 Camera Edited Next Day'
      repeat_frequency: 'Weekly' | 'Fortnightly' | 'Monthly Week 0' | 'Monthly Week 1' | 'Monthly' | 'None'
      day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
      content_status: 'Planned' | 'Shoot Booked' | 'Filmed' | 'Editing' | 'QC' | 'Ready for Scheduling' | 'Published'
      content_type: 'Car of the Week' | 'Car Highlight' | 'Culture Reel' | 'Trendy TikTok Reel' | 'Informative Reel' | 'Reel Support Post' | 'Delivery Post' | 'Reel Support Story' | 'Testimonial Story' | 'Ad'
      content_format: 'Reel' | 'Post' | 'Story' | 'Ad'
      content_repeat_frequency: '1w' | '2w' | '3w' | '4w'
      lead_type: 'Lead Form' | 'Landing Page'
      planning_meeting_status: 'Scheduled' | 'Completed' | 'Cancelled'
      audit_action: 'create' | 'update' | 'delete'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

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
