import { useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

interface SignupResult {
  success: boolean;
  message: string;
}

export function useNewsletterSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (email: string, nome?: string): Promise<SignupResult> => {
    setLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase não configurado');
      }

      const supabase = getSupabase();
      if (!supabase) {
        throw new Error('Supabase não disponível');
      }

      const { data, error: invokeError } = await supabase.functions.invoke(
        'brevo-subscribe',
        {
          body: { email, nome },
        }
      );

      if (invokeError) {
        throw new Error(invokeError.message || 'Erro ao inscrever');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return {
        success: true,
        message: data?.message || 'Inscrição realizada com sucesso!',
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao inscrever na newsletter';
      setError(message);
      return {
        success: false,
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    signup,
    loading,
    error,
  };
}
