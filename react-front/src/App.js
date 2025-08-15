import React, { useState } from 'react';
import AudioRecorder from './components/AudioRecorder';

function App() {
  const [transcription, setTranscription] = useState('');
  const [translation, setTranslation] = useState('');

  return (
    <div>
      <h1>STT + Translate Demo</h1>
      <AudioRecorder 
        onTranscription={(text) => setTranscription(text)}
        onTranslation={(text) => setTranslation(text)}
      />
    </div>
  );
}

export default App;
