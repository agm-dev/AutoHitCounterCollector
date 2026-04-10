import { useEffect, useState } from 'react'

function App(): React.JSX.Element {
  const [hits, setHits] = useState<Awaited<ReturnType<typeof window.api.getLastEntries>>>([]);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof window.api.getStats>> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [_stats, _lastEntries] = await Promise.all([
        window.api.getStats(),
        window.api.getLastEntries(10)
      ]);
      setStats(_stats);
      setHits(_lastEntries);
    }

    loadData();
    window.electron.ipcRenderer.on('hit', loadData);
    return () => {
      window.electron.ipcRenderer.removeAllListeners('hit');
    };
  }, []);

  return (
    <>
      <div className="app"></div>
        <h1>Hits:</h1>
        <ul>
          {hits.map((hit, index) => (
            <li key={index}>{hit.id} - {hit.received_at}</li>
          ))}
        </ul>
        <h2>Stats:</h2>
        <p>Today Hits: {stats?.today}</p>
    </>
  )
}

export default App
