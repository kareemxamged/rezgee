import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sbtzngewizgeqzfbhfjy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNidHpuZ2V3aXpnZXF6ZmJoZmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMzc5MTMsImV4cCI6MjA2NjcxMzkxM30.T8iv9C4OeKAb-e4Oz6uw3tFnMrgFK3SKN6fVCrBEUGo';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  age?: number;
  gender?: 'male' | 'female';
  city?: string;
  marital_status?: 'single' | 'divorced' | 'widowed';
  education?: string;
  profession?: string;
  religious_commitment?: 'high' | 'medium' | 'practicing';
  bio?: string;
  looking_for?: string;
  profile_visibility?: 'public' | 'members' | 'verified';
  show_phone?: boolean;
  show_email?: boolean;
  allow_messages?: boolean;
  family_can_view?: boolean;
  two_factor_enabled?: boolean;
  login_notifications?: boolean;
  message_notifications?: boolean;
  verified?: boolean;
  status?: 'active' | 'suspended' | 'inactive';
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  status?: 'active' | 'blocked' | 'archived';
  family_involved?: boolean;
  family_email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type?: 'text' | 'image' | 'file';
  moderation_status?: 'pending' | 'approved' | 'rejected';
  moderation_reason?: string;
  flagged_words?: string[];
  severity?: 'low' | 'medium' | 'high';
  read_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Report {
  id: string;
  reported_user_id: string;
  reporter_id: string;
  reason: string;
  description?: string;
  severity?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'approved' | 'rejected' | 'resolved';
  admin_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  user1_interested?: boolean;
  user2_interested?: boolean;
  match_score?: number;
  status?: 'pending' | 'matched' | 'declined';
  created_at?: string;
  updated_at?: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type?: string;
  target_id?: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export interface SiteText {
  id: string;
  text_key: string;
  category: string;
  language: string;
  text_value: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface TextChangeLog {
  id: string;
  text_id: string;
  old_value?: string;
  new_value?: string;
  change_type: 'create' | 'update' | 'delete';
  changed_by?: string;
  changed_at?: string;
  change_reason?: string;
}

// Authentication functions
export const authService = {
  // Sign up new user
  async signUp(email: string, password: string, userData: Partial<User>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Insert user profile data
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            password_hash: 'handled_by_supabase_auth',
            ...userData
          });

        if (profileError) throw profileError;
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign in user
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update last login
      if (data.user) {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // Get user profile
  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  }
};

// User service functions
export const userService = {
  // Get all users with filters
  async getUsers(filters: {
    ageMin?: number;
    ageMax?: number;
    city?: string;
    gender?: string;
    maritalStatus?: string;
    religiousCommitment?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    let query = supabase
      .from('users')
      .select('*')
      .eq('status', 'active')
      .eq('verified', true);

    if (filters.ageMin) {
      query = query.gte('age', filters.ageMin);
    }
    if (filters.ageMax) {
      query = query.lte('age', filters.ageMax);
    }
    if (filters.city) {
      query = query.ilike('city', `%${filters.city}%`);
    }
    if (filters.gender) {
      query = query.eq('gender', filters.gender);
    }
    if (filters.maritalStatus && filters.maritalStatus !== 'any') {
      query = query.eq('marital_status', filters.maritalStatus);
    }
    if (filters.religiousCommitment && filters.religiousCommitment !== 'any') {
      query = query.eq('religious_commitment', filters.religiousCommitment);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  },

  // Get user statistics
  async getUserStats() {
    const { data: totalUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact' });

    const { data: activeUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('status', 'active');

    const { data: verifiedUsers } = await supabase
      .from('users')
      .select('id', { count: 'exact' })
      .eq('verified', true);

    return {
      total: totalUsers?.length || 0,
      active: activeUsers?.length || 0,
      verified: verifiedUsers?.length || 0
    };
  }
};

// Message service functions
export const messageService = {
  // Get conversations for a user
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        user1:users!conversations_user1_id_fkey(id, first_name, last_name, verified),
        user2:users!conversations_user2_id_fkey(id, first_name, last_name, verified)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    return { data, error };
  },

  // Get messages for a conversation
  async getMessages(conversationId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(id, first_name, last_name)
      `)
      .eq('conversation_id', conversationId)
      .eq('moderation_status', 'approved')
      .order('created_at', { ascending: true });

    return { data, error };
  },

  // Send a message
  async sendMessage(conversationId: string, senderId: string, content: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        moderation_status: 'pending' // Will be moderated
      })
      .select()
      .single();

    return { data, error };
  },

  // Create or get conversation
  async createConversation(user1Id: string, user2Id: string) {
    // Check if conversation already exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .single();

    if (existing) {
      return { data: existing, error: null };
    }

    // Create new conversation
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id
      })
      .select()
      .single();

    return { data, error };
  }
};

// Admin service functions
export const adminService = {
  // Get pending messages for moderation
  async getPendingMessages() {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users(id, first_name, last_name),
        conversation:conversations(
          user1:users!conversations_user1_id_fkey(id, first_name, last_name),
          user2:users!conversations_user2_id_fkey(id, first_name, last_name)
        )
      `)
      .eq('moderation_status', 'pending')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Moderate message
  async moderateMessage(messageId: string, status: 'approved' | 'rejected', reason?: string) {
    const { data, error } = await supabase
      .from('messages')
      .update({
        moderation_status: status,
        moderation_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId)
      .select()
      .single();

    return { data, error };
  },

  // Get reports
  async getReports() {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        reported_user:users!reports_reported_user_id_fkey(id, first_name, last_name),
        reporter:users!reports_reporter_id_fkey(id, first_name, last_name)
      `)
      .order('created_at', { ascending: false });

    return { data, error };
  },

  // Update report status
  async updateReportStatus(reportId: string, status: string, adminNotes?: string) {
    const { data, error } = await supabase
      .from('reports')
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    return { data, error };
  }
};

// Site Text Management functions
export const textService = {
  // Get all texts for a specific language
  async getTexts(language: string = 'ar') {
    const { data, error } = await supabase
      .from('site_texts')
      .select('*')
      .eq('language', language)
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('text_key', { ascending: true });

    return { data, error };
  },

  // Get texts by category
  async getTextsByCategory(category: string, language: string = 'ar') {
    const { data, error } = await supabase
      .from('site_texts')
      .select('*')
      .eq('category', category)
      .eq('language', language)
      .eq('is_active', true)
      .order('text_key', { ascending: true });

    return { data, error };
  },

  // Get a specific text by key and language
  async getText(textKey: string, language: string = 'ar') {
    const { data, error } = await supabase
      .from('site_texts')
      .select('*')
      .eq('text_key', textKey)
      .eq('language', language)
      .eq('is_active', true)
      .single();

    return { data, error };
  },

  // Get all texts formatted for i18next
  async getTextsForI18n(language: string = 'ar') {
    const { data, error } = await supabase
      .from('site_texts')
      .select('text_key, text_value')
      .eq('language', language)
      .eq('is_active', true);

    if (error) return { data: null, error };

    // Convert to nested object structure for i18next
    const texts: any = {};
    data?.forEach((item) => {
      const keys = item.text_key.split('.');
      let current = texts;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = item.text_value;
    });

    return { data: texts, error: null };
  },

  // Create or update a text
  async upsertText(textData: Partial<SiteText>) {
    const { data, error } = await supabase
      .from('site_texts')
      .upsert(textData, {
        onConflict: 'text_key,language'
      })
      .select()
      .single();

    return { data, error };
  },

  // Update a text
  async updateText(id: string, updates: Partial<SiteText>) {
    const { data, error } = await supabase
      .from('site_texts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Delete a text (soft delete by setting is_active to false)
  async deleteText(id: string) {
    const { data, error } = await supabase
      .from('site_texts')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  // Search texts
  async searchTexts(query: string, language?: string, category?: string) {
    let queryBuilder = supabase
      .from('site_texts')
      .select('*')
      .eq('is_active', true);

    if (language) {
      queryBuilder = queryBuilder.eq('language', language);
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    queryBuilder = queryBuilder.or(`text_key.ilike.%${query}%,text_value.ilike.%${query}%,description.ilike.%${query}%`);

    const { data, error } = await queryBuilder
      .order('category', { ascending: true })
      .order('text_key', { ascending: true });

    return { data, error };
  },

  // Get all categories
  async getCategories() {
    const { data, error } = await supabase
      .from('site_texts')
      .select('category')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (error) return { data: null, error };

    const categories = [...new Set(data?.map(item => item.category))];
    return { data: categories, error: null };
  },

  // Get text change logs
  async getTextChangeLogs(textId?: string, limit: number = 50) {
    let queryBuilder = supabase
      .from('text_change_logs')
      .select(`
        *,
        site_texts(text_key, category, language)
      `)
      .order('changed_at', { ascending: false })
      .limit(limit);

    if (textId) {
      queryBuilder = queryBuilder.eq('text_id', textId);
    }

    const { data, error } = await queryBuilder;
    return { data, error };
  }
};

export default supabase;
