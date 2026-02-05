import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Session, SessionId, UserProfile } from '../backend';

export function useGetAllSessions() {
  const { actor, isFetching } = useActor();

  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStartSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<SessionId> => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.startSession();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useUpdateSessionTask() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, task }: { sessionId: SessionId; task: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateSessionTask(sessionId, task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useUpdateSessionOutcome() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, outcome }: { sessionId: SessionId; outcome: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateSessionOutcome(sessionId, outcome);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useEndSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: SessionId) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.endSession(sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

export function useGenerateFocusTask() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      userInput,
      context,
      duration,
    }: {
      userInput: string;
      context: string;
      duration: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      
      try {
        const result = await actor.generateFocusTask(userInput, context, duration);
        return result;
      } catch (error) {
        console.error('OpenAI API call failed:', error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1500,
  });
}

export function useIsApiKeyConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['apiKeyConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isApiKeyConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStoreApiKey() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.storeApiKey(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiKeyConfigured'] });
    },
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function parseAIResponse(result: string): string {
  const errorString = String(result).toLowerCase();
  
  if (
    errorString.includes('openai api key not found') || 
    errorString.includes('openai api key found but empty') ||
    errorString.includes('missing openai api key') ||
    errorString.includes('must set key on initial deployment') ||
    errorString.includes('must provide valid key')
  ) {
    throw new Error('AI_KEY_ERROR');
  }

  if (
    errorString.includes('ai service unavailable') || 
    errorString.includes('network error') ||
    errorString.includes('invalid api response') ||
    errorString.includes('request timeout')
  ) {
    throw new Error('AI_SERVICE_ERROR');
  }

  try {
    const parsed = JSON.parse(result);
    
    // Support Responses-style output_text field
    if (parsed.output_text && typeof parsed.output_text === 'string') {
      return normalizeTaskOutput(parsed.output_text);
    }
    
    // Support legacy choices format
    if (parsed.choices && Array.isArray(parsed.choices) && parsed.choices.length > 0) {
      const messageContent = parsed.choices[0]?.message?.content;
      
      if (messageContent && typeof messageContent === 'string') {
        return normalizeTaskOutput(messageContent);
      }
    }
    
    if (parsed.error) {
      console.error('OpenAI API error:', parsed.error);
      
      if (parsed.error.code === 'invalid_api_key' || parsed.error.type === 'invalid_request_error') {
        throw new Error('AI_KEY_ERROR');
      }
      
      throw new Error('AI_API_ERROR');
    }
    
    if (result.length > 5 && !result.startsWith('{')) {
      return normalizeTaskOutput(result);
    }
    
    throw new Error('Invalid response format');
  } catch (parseError) {
    if (parseError instanceof Error && 
        (parseError.message === 'AI_KEY_ERROR' || 
         parseError.message === 'AI_SERVICE_ERROR' || 
         parseError.message === 'AI_API_ERROR')) {
      throw parseError;
    }
    
    if (result && typeof result === 'string' && result.length > 5) {
      return normalizeTaskOutput(result);
    }
    
    throw new Error('Invalid AI response');
  }
}

function normalizeTaskOutput(text: string): string {
  let task = text.trim();
  
  // Remove AI self-references and greetings
  task = task.replace(/^(Hello|Hi|Hey|Greetings|As an AI|I'm an AI|I am an AI)[^.!?]*[.!?]\s*/gi, '');
  task = task.replace(/^(Sure|Certainly|Of course|Absolutely)[^.!?]*[.!?]\s*/gi, '');
  
  // Extract first actionable sentence if multi-paragraph
  const sentences = task.split(/[.!?]+\s+/);
  if (sentences.length > 1) {
    // Find first sentence that looks like an action (contains verb patterns)
    const actionSentence = sentences.find(s => 
      s.length > 10 && 
      /\b(write|create|review|complete|finish|start|begin|work|focus|spend|take|choose|identify|set|do)\b/i.test(s)
    );
    task = actionSentence || sentences[0];
  }
  
  // Remove .semanticDot artifacts
  task = task.replace(/\.semanticDot\.?$/g, '').trim();
  
  // Ensure proper punctuation
  if (task && !task.match(/[.!?]$/)) {
    task += '.';
  }
  
  // Validate minimum length
  if (task.length < 5) {
    throw new Error('Task too short');
  }
  
  return task;
}

export function getFallbackTask(context: string): string {
  const fallbacks: Record<string, string> = {
    'overwhelmed': 'Write down the three most important things on your mind right now.',
    'unclear': 'Identify one task that would make today feel successful.',
    'distracted': 'Set a timer for 15 minutes and work on one thing without checking your phone.',
    'tired': 'Do a simple task that requires minimal mental effort to build momentum.',
    'anxious': 'Take five deep breaths and choose one small action to start.',
  };
  
  return fallbacks[context] || 'Choose one small task and work on it for 10 minutes.';
}

export function getErrorMessage(error: unknown): { message: string; isAdminError: boolean } {
  if (error instanceof Error) {
    if (error.message === 'AI_KEY_ERROR') {
      return {
        message: 'OpenAI API key is missing or invalid. Please contact the administrator to configure the API key.',
        isAdminError: true,
      };
    }
    if (error.message === 'AI_SERVICE_ERROR') {
      return {
        message: 'AI service temporarily unavailable. Using a suggested task.',
        isAdminError: false,
      };
    }
    if (error.message === 'AI_API_ERROR') {
      return {
        message: 'AI service error. Using a suggested task.',
        isAdminError: false,
      };
    }
    if (error.message === 'Request timeout') {
      return {
        message: 'Request took too long. Using a suggested task.',
        isAdminError: false,
      };
    }
  }
  
  const errorString = String(error).toLowerCase();
  if (
    errorString.includes('openai api key') || 
    errorString.includes('must set key') ||
    errorString.includes('must provide valid key')
  ) {
    return {
      message: 'OpenAI API key is missing or invalid. Please contact the administrator to configure the API key.',
      isAdminError: true,
    };
  }
  
  return {
    message: 'Unable to generate task. Using a suggested alternative.',
    isAdminError: false,
  };
}
