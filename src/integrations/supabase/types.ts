export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clinicas: {
        Row: {
          asesor: string
          color: string
          created_at: string
          fecha_inicio: string
          id: string
          iniciales: string
          nombre_clinica: string
          nombre_doctor: string
          paquete: string
          servicios_contratados: Database["public"]["Enums"]["servicio_slug"][]
          updated_at: string
          whatsapp_link: string
        }
        Insert: {
          asesor?: string
          color?: string
          created_at?: string
          fecha_inicio?: string
          id?: string
          iniciales?: string
          nombre_clinica: string
          nombre_doctor: string
          paquete?: string
          servicios_contratados?: Database["public"]["Enums"]["servicio_slug"][]
          updated_at?: string
          whatsapp_link?: string
        }
        Update: {
          asesor?: string
          color?: string
          created_at?: string
          fecha_inicio?: string
          id?: string
          iniciales?: string
          nombre_clinica?: string
          nombre_doctor?: string
          paquete?: string
          servicios_contratados?: Database["public"]["Enums"]["servicio_slug"][]
          updated_at?: string
          whatsapp_link?: string
        }
        Relationships: []
      }
      entregables: {
        Row: {
          clinica_id: string
          created_at: string
          fecha: string | null
          id: string
          nombre: string
          servicio_slug: Database["public"]["Enums"]["servicio_slug"]
          status: string
          updated_at: string
          version: string
        }
        Insert: {
          clinica_id: string
          created_at?: string
          fecha?: string | null
          id?: string
          nombre: string
          servicio_slug: Database["public"]["Enums"]["servicio_slug"]
          status?: string
          updated_at?: string
          version?: string
        }
        Update: {
          clinica_id?: string
          created_at?: string
          fecha?: string | null
          id?: string
          nombre?: string
          servicio_slug?: Database["public"]["Enums"]["servicio_slug"]
          status?: string
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "entregables_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      looms: {
        Row: {
          clinica_id: string
          created_at: string
          duracion: string
          fecha: string | null
          id: string
          link_loom: string
          resumen: string[]
          semana: number
          servicios_slugs: Database["public"]["Enums"]["servicio_slug"][]
          tags: string[]
          titulo: string
          updated_at: string
          visto_cliente: boolean
        }
        Insert: {
          clinica_id: string
          created_at?: string
          duracion?: string
          fecha?: string | null
          id?: string
          link_loom?: string
          resumen?: string[]
          semana?: number
          servicios_slugs?: Database["public"]["Enums"]["servicio_slug"][]
          tags?: string[]
          titulo: string
          updated_at?: string
          visto_cliente?: boolean
        }
        Update: {
          clinica_id?: string
          created_at?: string
          duracion?: string
          fecha?: string | null
          id?: string
          link_loom?: string
          resumen?: string[]
          semana?: number
          servicios_slugs?: Database["public"]["Enums"]["servicio_slug"][]
          tags?: string[]
          titulo?: string
          updated_at?: string
          visto_cliente?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "looms_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      metricas: {
        Row: {
          clinica_id: string
          created_at: string
          current_value: string
          id: string
          metric_name: string
          positivo: boolean
          servicio_slug: Database["public"]["Enums"]["servicio_slug"]
          status: string
          trend_percentage: string
          updated_at: string
        }
        Insert: {
          clinica_id: string
          created_at?: string
          current_value?: string
          id?: string
          metric_name: string
          positivo?: boolean
          servicio_slug: Database["public"]["Enums"]["servicio_slug"]
          status?: string
          trend_percentage?: string
          updated_at?: string
        }
        Update: {
          clinica_id?: string
          created_at?: string
          current_value?: string
          id?: string
          metric_name?: string
          positivo?: boolean
          servicio_slug?: Database["public"]["Enums"]["servicio_slug"]
          status?: string
          trend_percentage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "metricas_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      miembros: {
        Row: {
          avatar_color: string
          clinica_id: string
          created_at: string
          email: string | null
          equipo: string
          id: string
          iniciales: string
          nombre: string
          rol: string
          updated_at: string
        }
        Insert: {
          avatar_color?: string
          clinica_id: string
          created_at?: string
          email?: string | null
          equipo?: string
          id?: string
          iniciales?: string
          nombre: string
          rol?: string
          updated_at?: string
        }
        Update: {
          avatar_color?: string
          clinica_id?: string
          created_at?: string
          email?: string | null
          equipo?: string
          id?: string
          iniciales?: string
          nombre?: string
          rol?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "miembros_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      pasos: {
        Row: {
          clinica_id: string
          created_at: string
          fecha_iso: string | null
          id: string
          servicio_slug: Database["public"]["Enums"]["servicio_slug"] | null
          texto: string
          tipo: string
          updated_at: string
        }
        Insert: {
          clinica_id: string
          created_at?: string
          fecha_iso?: string | null
          id?: string
          servicio_slug?: Database["public"]["Enums"]["servicio_slug"] | null
          texto: string
          tipo?: string
          updated_at?: string
        }
        Update: {
          clinica_id?: string
          created_at?: string
          fecha_iso?: string | null
          id?: string
          servicio_slug?: Database["public"]["Enums"]["servicio_slug"] | null
          texto?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pasos_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          clinica_id: string | null
          created_at: string
          email: string | null
          id: string
          nombre: string | null
          updated_at: string
        }
        Insert: {
          clinica_id?: string | null
          created_at?: string
          email?: string | null
          id: string
          nombre?: string | null
          updated_at?: string
        }
        Update: {
          clinica_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nombre?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      recursos: {
        Row: {
          categoria: string
          clinica_id: string
          created_at: string
          descripcion: string
          id: string
          link: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          categoria?: string
          clinica_id: string
          created_at?: string
          descripcion?: string
          id?: string
          link?: string
          tipo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          clinica_id?: string
          created_at?: string
          descripcion?: string
          id?: string
          link?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recursos_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      tarea_comentarios: {
        Row: {
          autor: string
          created_at: string
          created_by: string | null
          id: string
          tarea_id: string
          texto: string
        }
        Insert: {
          autor: string
          created_at?: string
          created_by?: string | null
          id?: string
          tarea_id: string
          texto: string
        }
        Update: {
          autor?: string
          created_at?: string
          created_by?: string | null
          id?: string
          tarea_id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarea_comentarios_tarea_id_fkey"
            columns: ["tarea_id"]
            isOneToOne: false
            referencedRelation: "tareas"
            referencedColumns: ["id"]
          },
        ]
      }
      tareas: {
        Row: {
          clinica_id: string
          creado_por: string
          created_at: string
          created_by: string | null
          descripcion: string | null
          entregable_id: string | null
          estado: Database["public"]["Enums"]["tarea_estado"]
          fecha_entrega: string | null
          id: string
          prioridad: Database["public"]["Enums"]["tarea_prioridad"]
          servicio_slug: Database["public"]["Enums"]["servicio_slug"]
          titulo: string
          updated_at: string
        }
        Insert: {
          clinica_id: string
          creado_por?: string
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          entregable_id?: string | null
          estado?: Database["public"]["Enums"]["tarea_estado"]
          fecha_entrega?: string | null
          id?: string
          prioridad?: Database["public"]["Enums"]["tarea_prioridad"]
          servicio_slug: Database["public"]["Enums"]["servicio_slug"]
          titulo: string
          updated_at?: string
        }
        Update: {
          clinica_id?: string
          creado_por?: string
          created_at?: string
          created_by?: string | null
          descripcion?: string | null
          entregable_id?: string | null
          estado?: Database["public"]["Enums"]["tarea_estado"]
          fecha_entrega?: string | null
          id?: string
          prioridad?: Database["public"]["Enums"]["tarea_prioridad"]
          servicio_slug?: Database["public"]["Enums"]["servicio_slug"]
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tareas_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tareas_entregable_id_fkey"
            columns: ["entregable_id"]
            isOneToOne: false
            referencedRelation: "entregables"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          clinica_id: string
          created_at: string
          email: string
          id: string
          invited_by: string | null
          nombre: string
          rol: string
          status: Database["public"]["Enums"]["invitation_status"]
          updated_at: string
        }
        Insert: {
          clinica_id: string
          created_at?: string
          email: string
          id?: string
          invited_by?: string | null
          nombre: string
          rol?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          updated_at?: string
        }
        Update: {
          clinica_id?: string
          created_at?: string
          email?: string
          id?: string
          invited_by?: string | null
          nombre?: string
          rol?: string
          status?: Database["public"]["Enums"]["invitation_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_clinica_id_fkey"
            columns: ["clinica_id"]
            isOneToOne: false
            referencedRelation: "clinicas"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_agency: { Args: { _user_id: string }; Returns: boolean }
      my_clinica_id: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "agency_admin" | "client_user"
      invitation_status: "pending_approval" | "approved" | "rejected"
      servicio_slug: "diseno-web" | "seo" | "go-high-level" | "agentes-ia"
      tarea_estado: "backlog" | "en-progreso" | "revision" | "completado"
      tarea_prioridad: "alta" | "media" | "baja"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["agency_admin", "client_user"],
      invitation_status: ["pending_approval", "approved", "rejected"],
      servicio_slug: ["diseno-web", "seo", "go-high-level", "agentes-ia"],
      tarea_estado: ["backlog", "en-progreso", "revision", "completado"],
      tarea_prioridad: ["alta", "media", "baja"],
    },
  },
} as const
