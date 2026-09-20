import { TokenAllocationConfig, TokenBufferState, UserPlan } from '../types';

export const STORAGE_TOKEN_CONFIG_KEY = 'mayprompt_token_config_v2';
export const STORAGE_TOKEN_STATE_KEY = 'mayprompt_token_buffer_state_v2';

export const DEFAULT_TOKEN_CONFIG: TokenAllocationConfig = {
  primaryRatio: 0.70, // 70% userga bevosita beriladi
  bufferRatio: 0.30,  // 30% zaxira bufer sifatida ushlab turiladi
  googleSlidingWindowHours: 4, // Google'ning to'liq tiklanish oynasi
  displayRechargeWindowHours: 6, // Biz 6 soat ko'rsatamiz va 30% tokenni taqsimlaymiz
  cooldownMinHours: 2, // Eng kam uzilish vaqti
  cooldownMaxHours: 4, // Eng ko'p uzilish vaqti
  freeMaxSessionTokens: 50000, // Standart bepul seans hajmi (~8-12 kadrli tahlil)
};

export const INITIAL_BUFFER_STATE: TokenBufferState = {
  totalUsedTokens: 0,
  primaryUsedTokens: 0,
  bufferUsedTokens: 0,
  maxSessionTokens: DEFAULT_TOKEN_CONFIG.freeMaxSessionTokens,
  isBufferActive: false,
  isInCooldown: false,
  cooldownEndsAt: null,
  cooldownTotalDurationMs: 0,
};

// 1. Get & Save Config
export const getTokenConfig = (): TokenAllocationConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_TOKEN_CONFIG_KEY);
    if (saved) {
      return { ...DEFAULT_TOKEN_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error reading token config:', e);
  }
  return DEFAULT_TOKEN_CONFIG;
};

export const saveTokenConfig = (config: Partial<TokenAllocationConfig>): TokenAllocationConfig => {
  const current = getTokenConfig();
  const updated = { ...current, ...config };
  localStorage.setItem(STORAGE_TOKEN_CONFIG_KEY, JSON.stringify(updated));
  return updated;
};

// 2. Get & Save State
export const getTokenBufferState = (): TokenBufferState => {
  try {
    const saved = localStorage.getItem(STORAGE_TOKEN_STATE_KEY);
    if (saved) {
      const parsed: TokenBufferState = JSON.parse(saved);
      // Check if cooldown has expired
      if (parsed.isInCooldown && parsed.cooldownEndsAt) {
        if (Date.now() >= parsed.cooldownEndsAt) {
          // Cooldown expired! Reset tokens
          return resetTokenBufferState();
        }
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading buffer state:', e);
  }
  return INITIAL_BUFFER_STATE;
};

export const saveTokenBufferState = (state: TokenBufferState) => {
  localStorage.setItem(STORAGE_TOKEN_STATE_KEY, JSON.stringify(state));
};

export const resetTokenBufferState = (): TokenBufferState => {
  const config = getTokenConfig();
  const fresh: TokenBufferState = {
    ...INITIAL_BUFFER_STATE,
    maxSessionTokens: config.freeMaxSessionTokens,
  };
  saveTokenBufferState(fresh);
  return fresh;
};

// 3. Estimate tokens for message & images
export const estimateTurnTokens = (text: string, attachedImagesCount: number = 0): number => {
  // Rough Gemini tokenization:
  // - 1 English word ~ 1.3 tokens, Uzbek ~ 2 tokens
  // - 1 high-res image frame ~ 258 - 512 tokens
  // - System prompt overhead + model reply estimation ~ 800 tokens
  const textTokens = Math.ceil(text.length / 2.5);
  const imageTokens = attachedImagesCount * 450;
  const systemOverhead = 600;
  return textTokens + imageTokens + systemOverhead;
};

// 4. Check if user can send message or if in cooldown
export interface TokenCheckResult {
  allowed: boolean;
  reason?: string;
  inCooldown: boolean;
  cooldownRemainingMs: number;
  percentageUsed: number;
  isBufferActive: boolean;
  formattedCountdown?: string;
}

export const checkTokenAllowance = (plan: UserPlan): TokenCheckResult => {
  // Plus and Pro have no token cooldown restrictions
  if (plan === 'plus' || plan === 'pro') {
    return {
      allowed: true,
      inCooldown: false,
      cooldownRemainingMs: 0,
      percentageUsed: 0,
      isBufferActive: false,
    };
  }

  const state = getTokenBufferState();
  const config = getTokenConfig();

  // Check cooldown expiration
  if (state.isInCooldown && state.cooldownEndsAt) {
    const remaining = state.cooldownEndsAt - Date.now();
    if (remaining > 0) {
      return {
        allowed: false,
        reason: `Gemini Free token zaxirasi tugagan. Yangilanishga ${formatCooldownCountdown(remaining)} qoldi. Kutmasdan davom etish uchun Plus yoki Pro tarifiga o'ting.`,
        inCooldown: true,
        cooldownRemainingMs: remaining,
        percentageUsed: 100,
        isBufferActive: false,
        formattedCountdown: formatCooldownCountdown(remaining),
      };
    } else {
      // Auto-reset once time expires
      resetTokenBufferState();
    }
  }

  const totalCap = config.freeMaxSessionTokens;
  const primaryCap = totalCap * config.primaryRatio; // 70%

  const percentageUsed = Math.min(100, Math.round((state.totalUsedTokens / totalCap) * 100));
  const isBufferActive = state.totalUsedTokens >= primaryCap;

  return {
    allowed: true,
    inCooldown: false,
    cooldownRemainingMs: 0,
    percentageUsed,
    isBufferActive,
  };
};

// 5. Consume tokens after a turn
export const consumeTurnTokens = (
  plan: UserPlan,
  tokensEstimated: number
): { state: TokenBufferState; triggeredCooldown: boolean } => {
  if (plan === 'plus' || plan === 'pro') {
    return { state: getTokenBufferState(), triggeredCooldown: false };
  }

  const config = getTokenConfig();
  let state = getTokenBufferState();

  const totalCap = config.freeMaxSessionTokens;
  const primaryCap = totalCap * config.primaryRatio; // 70%

  const newTotal = state.totalUsedTokens + tokensEstimated;

  // Split into primary (first 70%) and buffer (last 30%)
  let newPrimary = state.primaryUsedTokens;
  let newBuffer = state.bufferUsedTokens;

  if (state.totalUsedTokens < primaryCap) {
    const spaceInPrimary = primaryCap - state.totalUsedTokens;
    if (tokensEstimated <= spaceInPrimary) {
      newPrimary += tokensEstimated;
    } else {
      newPrimary = primaryCap;
      newBuffer += tokensEstimated - spaceInPrimary;
    }
  } else {
    newBuffer += tokensEstimated;
  }

  let triggeredCooldown = false;
  let cooldownEndsAt = state.cooldownEndsAt;
  let isInCooldown = state.isInCooldown;
  let cooldownDuration = state.cooldownTotalDurationMs;

  // Check if fully depleted
  if (newTotal >= totalCap) {
    // Enter cooldown: between cooldownMinHours and cooldownMaxHours (e.g. 3 hours)
    const cooldownHours = (config.cooldownMinHours + config.cooldownMaxHours) / 2;
    cooldownDuration = cooldownHours * 60 * 60 * 1000;
    cooldownEndsAt = Date.now() + cooldownDuration;
    isInCooldown = true;
    triggeredCooldown = true;
  }

  const updatedState: TokenBufferState = {
    totalUsedTokens: newTotal,
    primaryUsedTokens: newPrimary,
    bufferUsedTokens: newBuffer,
    maxSessionTokens: totalCap,
    isBufferActive: newTotal >= primaryCap,
    isInCooldown,
    cooldownEndsAt,
    cooldownTotalDurationMs: cooldownDuration,
  };

  saveTokenBufferState(updatedState);
  return { state: updatedState, triggeredCooldown };
};

// 6. Check if user can create a new chat
export const canCreateNewChat = (plan: UserPlan): { allowed: boolean; reason?: string } => {
  if (plan === 'plus' || plan === 'pro') {
    return { allowed: true };
  }

  const allowance = checkTokenAllowance(plan);
  if (allowance.inCooldown) {
    return {
      allowed: false,
      reason: `Sizning Free rejangizdagi tokenlar tugagan. 2-4 soatlik xavfsiz tanaffus o'tgach (${allowance.formattedCountdown}) yangi suhbat ochishingiz mumkin yoki cheklovsiz Plus/Pro ga o'ting.`,
    };
  }

  return { allowed: true };
};

// Format milliseconds into HH:MM:SS
export const formatCooldownCountdown = (ms: number): string => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hStr = String(hours).padStart(2, '0');
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');

  return `${hStr}:${mStr}:${sStr}`;
};
