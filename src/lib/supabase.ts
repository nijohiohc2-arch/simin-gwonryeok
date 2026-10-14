"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
/** 공개 키(publishable/anon)만 사용. 환경변수가 없으면 null → 전체가 localStorage 모드로 동작 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const supabase: SupabaseClient | null = url && key ? createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "pkce" } }) : null;
export const backendEnabled = !!supabase;
