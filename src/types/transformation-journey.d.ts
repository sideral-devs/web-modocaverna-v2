interface TransformationLevel {
  id: number
  name: string
  theme: string
  description: string
  min_points: number
  max_points: number
  color: string
  icon: string
  milestones: Milestone[]
  capitao_messages: CapitaoMessage[]
}

interface UserProgress {
  user_id: string
  current_level: number
  current_points: number
  total_points: number
  points_to_next_level: number
  level_progress_percentage: number
  badges_earned: Badge[]
  milestones_completed: string[]
  streak_count: number
  transformation_started_at: Date
  last_level_up_at?: Date
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  points_reward: number
  level_required: number
  category: 'streak' | 'challenge' | 'community' | 'productivity' | 'milestone'
}

interface Milestone {
  id: string
  name: string
  description: string
  points_reward: number
  badge_reward?: string
  level_required: number
  category: 'daily' | 'weekly' | 'monthly' | 'special'
  requirements: MilestoneRequirement[]
}

interface MilestoneRequirement {
  type: 'login_streak' | 'challenge_complete' | 'pomodoro_sessions' | 'community_posts' | 'goals_achieved' | 'course_complete'
  target_value: number
  current_value?: number
}

interface CapitaoMessage {
  id: string
  level: number
  trigger: 'level_up' | 'milestone' | 'streak_lost' | 'challenge_start' | 'daily_checkin' | 'encouragement'
  message: string
  tone: 'congratulatory' | 'encouraging' | 'motivational' | 'supportive' | 'celebratory'
}

interface PointsActivity {
  id: string
  user_id: string
  activity_type: 'login' | 'ritual' | 'pomodoro' | 'exercise' | 'meal' | 'goal' | 'challenge' | 'community' | 'course'
  points_earned: number
  description: string
  created_at: Date
  level_at_time: number
}

interface LevelUpEvent {
  id: string
  user_id: string
  from_level: number
  to_level: number
  points_at_levelup: number
  badges_earned: string[]
  created_at: Date
}