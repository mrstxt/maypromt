import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, UserPlan, PlanConfig } from '../types';
import { getDynamicPlans, getTodayDateString } from '../data/plans';
import {
  checkTokenAllowance,
  consumeTurnTokens,
  estimateTurnTokens,
  canCreateNewChat,
  resetTokenBufferState,
  TokenCheckResult,
} from '../services/tokenBufferEngine';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  loginWithGoogle: (email?: string, name?: string, avatar?: string) => void;
  logout: () => void;
  updatePlan: (newPlan: UserPlan) => void;
  canAnalyze: () => { allowed: boolean; reason?: string };
  recordUsage: () => boolean;
  remainingQuota: number;
  dailyLimit: number;
  isUnlimited: boolean;
  setCustomApiKey: (key: string) => void;
  tokenStatus: TokenCheckResult;
  consumeTokensForTurn: (text: string, imageCount?: number) => { allowed: boolean; inCooldown: boolean; reason?: string };
  checkCanCreateChat: () => { allowed: boolean; reason?: string; countdown?: string };
  resetTokenBuffer: () => void;
  plans: Record<UserPlan, PlanConfig>;
  refreshPlans: () => void;
}

const STORAGE_USER_KEY = 'mayprompt_user_auth_v2';

const DEFAULT_GUEST_USER: UserAccount = {
  id: 'usr_default_guest',
  email: 'baytirp.uz@gmail.com',
  name: 'Baytirp Google User',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
  plan: 'free',
  quotaUsedToday: 0,
  lastActiveDate: getTodayDateString(),
  createdAt: Date.now(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [plans, setPlans] = useState<Record<UserPlan, PlanConfig>>(() => getDynamicPlans());

  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) {
        const parsed: UserAccount = JSON.parse(saved);
        const today = getTodayDateString();
        if (parsed.lastActiveDate !== today) {
          parsed.quotaUsedToday = 0;
          parsed.lastActiveDate = today;
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading user auth:', e);
    }
    return DEFAULT_GUEST_USER;
  });

  const [tokenStatus, setTokenStatus] = useState<TokenCheckResult>(() =>
    checkTokenAllowance(user?.plan || 'free')
  );

  const refreshPlans = () => {
    setPlans(getDynamicPlans());
  };

  // Keep state synced with localStorage
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      } catch (e) {
        console.error('Error saving user auth:', e);
      }
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [user]);

  // Tick timer for cooldown countdown every 1s
  useEffect(() => {
    const check = () => {
      const status = checkTokenAllowance(user?.plan || 'free');
      setTokenStatus(status);
    };

    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, [user?.plan]);

  const loginWithGoogle = (customEmail?: string, customName?: string, customAvatar?: string) => {
    const today = getTodayDateString();
    const email = customEmail || 'baytirp.uz@gmail.com';
    const name = customName || (email.split('@')[0].toUpperCase() + ' (Google)');
    const avatar = customAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=18181b,27272a`;

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      email,
      name,
      avatarUrl: avatar,
      plan: user?.plan || 'free',
      quotaUsedToday: 0,
      lastActiveDate: today,
      createdAt: Date.now(),
    };
    setUser(newUser);
    setTokenStatus(checkTokenAllowance(newUser.plan));
  };

  const logout = () => {
    setUser(null);
  };

  const updatePlan = (newPlan: UserPlan) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        plan: newPlan,
      };
    });
    // Immediately refresh token status
    setTimeout(() => {
      setTokenStatus(checkTokenAllowance(newPlan));
    }, 50);
  };

  const setCustomApiKey = (key: string) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        customApiKey: key,
        plan: key.trim() ? 'pro' : prev.plan,
      };
    });
  };

  const currentPlanConfig = plans[user?.plan || 'free'] || plans.free;
  const dailyLimit = currentPlanConfig.dailyLimit;
  const isUnlimited = currentPlanConfig.isUnlimited || !!user?.customApiKey;
  const quotaUsed = user?.quotaUsedToday || 0;
  const remainingQuota = isUnlimited ? Infinity : Math.max(0, dailyLimit - quotaUsed);

  const canAnalyze = (): { allowed: boolean; reason?: string } => {
    if (!user) {
      return {
        allowed: false,
        reason: "Tahlil qilish uchun Google akkauntingiz orqali ro'yxatdan o'ting yoki tizimga kiring.",
      };
    }

    if (isUnlimited) {
      return { allowed: true };
    }

    // Check token buffer cooldown
    const allowance = checkTokenAllowance(user.plan);
    if (allowance.inCooldown) {
      return {
        allowed: false,
        reason: allowance.reason || "Token limitingiz tugagan. 2-4 soatlik tanaffusdan so'ng davom eting yoki Upgrade qiling.",
      };
    }

    if (quotaUsed >= dailyLimit) {
      return {
        allowed: false,
        reason: `Sizning bugungi ${currentPlanConfig.name} limitingiz tugadi (${dailyLimit}/${dailyLimit}). Cheklovsiz davom etish uchun Plus yoki Pro tarifiga o'ting.`,
      };
    }

    return { allowed: true };
  };

  const recordUsage = (): boolean => {
    if (!user) return false;

    const today = getTodayDateString();
    let currentUsed = user.quotaUsedToday;
    if (user.lastActiveDate !== today) {
      currentUsed = 0;
    }

    if (!isUnlimited && currentUsed >= dailyLimit) {
      return false;
    }

    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        quotaUsedToday: currentUsed + 1,
        lastActiveDate: today,
      };
    });

    return true;
  };

  const consumeTokensForTurn = (
    text: string,
    imageCount: number = 0
  ): { allowed: boolean; inCooldown: boolean; reason?: string } => {
    if (!user) return { allowed: false, inCooldown: false, reason: 'Tizimga kiring' };

    const allowance = checkTokenAllowance(user.plan);
    if (allowance.inCooldown) {
      return {
        allowed: false,
        inCooldown: true,
        reason: allowance.reason,
      };
    }

    const estimated = estimateTurnTokens(text, imageCount);
    const { triggeredCooldown } = consumeTurnTokens(user.plan, estimated);

    const newStatus = checkTokenAllowance(user.plan);
    setTokenStatus(newStatus);

    return {
      allowed: true,
      inCooldown: triggeredCooldown,
      reason: triggeredCooldown ? newStatus.reason : undefined,
    };
  };

  const checkCanCreateChat = (): { allowed: boolean; reason?: string; countdown?: string } => {
    const result = canCreateNewChat(user?.plan || 'free');
    const status = checkTokenAllowance(user?.plan || 'free');
    return {
      allowed: result.allowed,
      reason: result.reason,
      countdown: status.formattedCountdown,
    };
  };

  const resetTokenBuffer = () => {
    resetTokenBufferState();
    setTokenStatus(checkTokenAllowance(user?.plan || 'free'));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogle,
        logout,
        updatePlan,
        canAnalyze,
        recordUsage,
        remainingQuota,
        dailyLimit,
        isUnlimited,
        setCustomApiKey,
        tokenStatus,
        consumeTokensForTurn,
        checkCanCreateChat,
        resetTokenBuffer,
        plans,
        refreshPlans,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
