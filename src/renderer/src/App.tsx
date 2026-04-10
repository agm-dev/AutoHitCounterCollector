import { useEffect, useState } from 'react'

function App(): React.JSX.Element {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const handler = (_event, message) => {
      setLogs(prevLogs => [message, ...prevLogs].slice(0, 4));
    };

    window.electron.ipcRenderer.on('log', handler);

    return () => {
      window.electron.ipcRenderer.removeAllListeners('log');
    };
  }, []);

  return (
    <>
      <div className="app"></div>
        <h1>Logs:</h1>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
    </>
  )
}

export default App
