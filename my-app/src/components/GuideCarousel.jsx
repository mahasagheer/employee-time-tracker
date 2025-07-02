import React, { useState } from 'react';

const steps = [
  {
    image: '/images/step1.png',
    heading: 'START TRACKING TIME WITH PULSETRACK	',
    text: 'When PulseTrack works in the background, you can click through it. Make the agent active by pressing ctrl and click on it.',
  },
  {
    image: '/images/step2.png',
    heading: 'ANOTHER FEATURE',
    text: 'Description for the second step goes here.',
  },
  {
    image: '/images/step3.png',
    heading: 'ALL SET!',
    text: 'You are ready to use the app.',
  },
];

export default function GuideCarousel({ onFinish }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      if (window.electron && window.electron.ipcRenderer) {
        window.electron.ipcRenderer.send('show-timer-window');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl w-screen h-screen shadow-2xl overflow-hidden flex flex-col items-stretch">
      <div className="w-full h-1/2 bg-blue-100 flex items-center justify-center">
        <img src={steps[step].image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="p-8 pt-8 pb-6 flex flex-col items-center">
        <h2 className="text-3xl text-gray-600 font-bold uppercase m-0 mb-3 text-center tracking-wide">{steps[step].heading}</h2>
        <p className="text-lg text-gray-700 text-center mb-7">{steps[step].text}</p>
        <button className="bg-blue-500 text-white border-none rounded px-9 py-2.5 text-base cursor-pointer mb-4 transition-colors duration-200 hover:bg-blue-600" onClick={handleNext}>
          {step === steps.length - 1 ? 'Got it!' : 'Next'}
        </button>
        <div className="flex gap-2 justify-center mt-0">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`w-2.5 h-2.5 rounded-full ${idx === step ? 'bg-blue-500' : 'bg-gray-300'} inline-block transition-colors duration-200`}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 