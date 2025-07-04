import React, { useState } from 'react';
import GuideCarousel from './components/GuideCarousel';
import Login from './components/Login';
import TimerOverlay from './components/TimerOverlay';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [showGuide, setShowGuide] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [projects, setProjects] = useState(['Project A', 'Project B']);

  return (
    <div>
      {showLogin && <Login onLogin={() => { setShowLogin(false); setShowGuide(true); }} />}
      {showGuide && <GuideCarousel onFinish={() => { setShowGuide(false); setShowTimer(true); }} />}
      {showTimer && <TimerOverlay />}
    </div>
  );
}

export default App;
