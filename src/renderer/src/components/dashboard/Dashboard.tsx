// Dashboard.tsx
import { timeAgo } from "@renderer/utils/timeAgo"
import "./Dashboard.css"
import { formatIgt } from "@renderer/utils/formatIgt"

export interface Stats {
  total: number
  today: number
  unique_users: number
  unique_games: number
  lastReceived: string | null
}

export interface Hit {
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

type Props = {
  stats: Stats | null
  hits: Hit[]
}

export default function Dashboard({ stats, hits }: Props) {
  return (
    <div className="container">
      <div className="stats">
        <div className="stat-card">
          <span className="label">Total hits</span>
          <span className="value">{stats?.total ?? 0}</span>
        </div>

        <div className="stat-card">
          <span className="label">Hits Today</span>
          <span className="value">{stats?.today ?? 0}</span>
        </div>

        <div className="stat-card">
          <span className="label">Unique Users</span>
          <span className="value">{stats?.unique_users ?? 0}</span>
        </div>

        <div className="stat-card">
          <span className="label">Unique Games</span>
          <span className="value">{stats?.unique_games ?? 0}</span>
        </div>
      </div>

      <div className="last-hit">
        <span className="label">Last hit (ago)</span>
        <span className="big-time">{stats != null ? timeAgo(stats.lastReceived) : '?'}</span>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Game</th>
              <th>Run</th>
              <th>Split</th>
              <th>Split Hits</th>
              <th>Split PB</th>
              <th>Total Hits</th>
              <th>PB</th>
              <th>IGT</th>
              <th>Ago</th>
            </tr>
          </thead>

          <tbody>
            {hits.map((h) => (
              <tr key={h.id}>
                <td>{h.game}</td>
                <td>{h.run}</td>
                <td>{h.split}</td>
                <td>{h.split_hits}</td>
                <td>{h.split_pb}</td>
                <td>{h.total_hits}</td>
                <td>{h.total_pb}</td>
                <td>{formatIgt(h.igt_ms)}</td>
                <td>{timeAgo(h.received_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}