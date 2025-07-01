import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Layout() {
    return (
        <div>
            <h1>Layout</h1>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/work">Work</Link>
                </li>
            </ul>
            <button
              onClick={() => {
                if (window.electron && window.electron.ipcRenderer) {
                  window.electron.ipcRenderer.send("start-tracking");
                } else {
                  alert("This feature is only available in the Electron app.");
                }
              }}
            >
              Start Tracking
            </button>
            <button onClick={() => window.electron.ipcRenderer.send("stop-tracking")}>Stop</button>
<button onClick={() => window.electron.ipcRenderer.send("sync-data")}>Sync</button>

            <Outlet />
        </div>
    )
}