export type TargetGenerator = 'midjourney' | 'sora_runway' | 'flux' | 'kling' | 'shotlist';

export interface ShotAnalysisData {
  id: string;
  timestamp: number;
  thumbnail?: string;
  summaryTitle: string;
  genre: string;
  overview: string;
  rakursAndCamera: {
    angle: string;
    shotType: string;
    movement: string;
    focalLength: string;
    depthOfField: string;
    composition: string;
  };
  lightingAndAtmosphere: {
    style: string;
    keyLight: string;
    fillLight: string;
    backgroundLight: string;
    colorGrade: string;
    palette: string[];
  };
  faceAndSubject: {
    subjectDescription: string;
    expression: string;
    headTiltAndGaze: string;
    poseAndBodyLanguage: string;
    stylingAndClothing: string;
  };
  syomkaBlueprint: {
    mobileFilmingTips: string[];
    recommendedSettings: string;
    diyLighting: string;
    directorAdvice: string;
  };
  prompts: {
    midjourney: string;
    fluxPrompt: string;
    soraPrompt: string;
    runwayGen3: {
      prompt: string;
      cameraMovementTag: string;
      motionStrength: number;
    };
    klingAi: {
      prompt: string;
      cameraSettings: {
        pan: string;
        tilt: string;
        zoom: string;
        roll: string;
      };
      motionBrushTips: string;
    };
    imageToVideo: {
      firstFramePrompt: string;
      motionPrompt: string;
      recommendedTool: string;
    };
    videoNegativePrompt: string;
    uzbekShootingScript: string;
  };
  aiReplicationGuide: {
    strategyOverview: string;
    recommendedWorkflow: string[];
    cameraPhysicsAdvice: string;
  };
  tags: string[];
}

export interface AnalysisRequestPayload {
  images: {
    dataUrl: string;
    timestamp?: number;
    label?: string;
  }[];
  focusMode?: 'all' | 'camera_lighting' | 'face_pose' | 'gear_shotlist';
  customNote?: string;
  styleModifier?: 'original' | 'cinematic' | 'cyberpunk' | 'vintage' | 'minimalist';
  preferredLanguage?: 'uz' | 'en' | 'both';
}

export interface SampleVideoItem {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  videoUrl?: string;
  frames: string[];
}

export type UserPlan = 'free' | 'plus' | 'pro';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  plan: UserPlan;
  quotaUsedToday: number;
  lastActiveDate: string; // YYYY-MM-DD
  createdAt: number;
  customApiKey?: string;
}

export interface PlanConfig {
  id: UserPlan;
  name: string;
  geminiTier: string;
  dailyLimit: number;
  isUnlimited: boolean;
  priceLabel: string;
  tagline: string;
  features: string[];
  badgeColor: string;
  accentColor: string;
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  views?: number;
  isReel?: boolean;
  postedAt: string;
}

export interface InstagramProfileData {
  username: string;
  fullName: string;
  avatarUrl: string;
  isVerified: boolean;
  bio: string;
  externalUrl?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  engagementRate: number; // e.g. 4.8%
  recentPosts: InstagramPost[];
}

export interface InstagramMarketingAnalysis {
  profileOverview: {
    niche: string;
    strengths: string[];
    growthOpportunities: string[];
  };
  contentStrategy: {
    topFormats: string[];
    idealPostingTimes: string[];
    lightingAndVisualTips: string[];
  };
  viralReelsIdeas: {
    title: string;
    hook: string;
    cameraShotAngle: string;
    aiVideoPrompt: string;
    marketingGoal: string;
  }[];
  marketingRoadmap: {
    week: string;
    focus: string;
    actionItems: string[];
  }[];
  appliedBooksKnowledge?: string[];
}

export interface MarketingBookItem {
  id: string;
  title: string;
  author: string;
  category: string;
  summary: string;
  keyInsights: string[];
  contentSnippet: string;
  uploadedAt: string;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  promptSuggestion?: string;
  attachedImage?: string;
  extensionBadge?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
  contextData?: ShotAnalysisData | null;
  attachedImage?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'vip_drop' | 'quota' | 'marketing' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
