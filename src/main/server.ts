import { BrowserWindow } from 'electron';
import express, { Request, Response } from 'express';
import { Server } from 'http';
import { RawRunEntry, RunEntry } from './types';

const REQUIRED_FIELDS: Array<{ key: keyof RawRunEntry; type: string }> = [
  { key: 'UserId',           type: 'string'  },
  { key: 'GameName',         type: 'string'  },
  { key: 'GameProfile',      type: 'string'  },
  { key: 'SplitName',        type: 'string'  },
  { key: 'SplitHits',        type: 'number'  },
  { key: 'TotalHits',        type: 'number'  },
  { key: 'Timestamp',        type: 'string'  },
  { key: 'AttemptCount',     type: 'number'  },
  { key: 'SplitPB',          type: 'number'  },
  { key: 'TotalPB',          type: 'number'  },
  { key: 'IgtMilliseconds',  type: 'number'  },
]

const app = express();
const PORT = 3456;

let server: Server | null = null;
let mainWindow: BrowserWindow | null = null;

app.use(express.json());

app.post('/hits', (req: Request, res: Response) => {
  const body = req.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  const errors: string[] = []
  for (const { key, type } of REQUIRED_FIELDS) {
    if (body[key] === undefined || body[key] === null) {
      errors.push(`Missing required field: ${key}`)
    } else if (typeof body[key] !== type) {
      errors.push(`Field '${key}' must be of type ${type}, received ${typeof body[key]}`)
    }
  }
  if (errors.length > 0) {
    return res.status(400).json({ error: 'Failed validation', details: errors })
  }

  const payload: Omit<RunEntry, 'id' | 'received_at'> = {
    user_id:       body.UserId,
    game:          body.GameName,
    run:           body.GameProfile,
    split:         body.SplitName,
    split_hits:    body.SplitHits,
    total_hits:    body.TotalHits,
    timestamp:     body.Timestamp,
    attempt_count: body.AttemptCount,
    split_pb:      body.SplitPB,
    total_pb:      body.TotalPB,
    igt_ms:        body.IgtMilliseconds,
  }

  console.log("Received hit data:", payload);
  mainWindow?.webContents.send('log', JSON.stringify(payload));

  return res.status(200).json({ message: 'OK', data: payload })
});

export function startServer({
  browserWindow
}: {
  browserWindow: BrowserWindow
}): Promise<void> {
  mainWindow = browserWindow;

  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      resolve();
    });
  });
}

export function stopServer(): Promise<void> {
  return new Promise((resolve) => {
    if (server) {
      server.close(() => resolve())
    } else {
      resolve()
    }
  })
}