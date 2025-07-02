import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import GuideCarousel from './components/GuideCarousel';

function App() {
  const [showGuide, setShowGuide] = useState(true);
  const [showTimer, setShowTimer] = useState(false);

  return (
    <div className="App">
      {showGuide && <GuideCarousel onFinish={() => { setShowGuide(false); setShowTimer(true); }} />}
    </div>
  );
}

export default App;
