export interface RawRunEntry {
  UserId: string
  GameName: string
  GameProfile: string
  SplitName: string
  SplitHits: number
  TotalHits: number
  Timestamp: string
  AttemptCount: number
  SplitPB: number
  TotalPB: number
  IgtMilliseconds: number
}

export interface RunEntry {
  id: number
  user_id: string
  game: string
  run: string
  split: string
  split_hits: number
  total_hits: number
  timestamp: string
  attempt_count: number
  split_pb: number
  total_pb: number
  igt_ms: number
  received_at: string
}