import React, { useState, useRef } from "react";
import axios from "axios";

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [translation, setTranslation] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setTranscript("");
    setTranslation("");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);

      const formData = new FormData();
      formData.append("file", blob, "audio.webm");

      try {
        const res = await axios.post("http://localhost:5001/transcribe", formData);
        setTranscript(res.data.transcript);
        setTranslation(res.data.translation);
      } catch (err) {
        console.error("Ошибка при транскрипции или переводе:", err);
      }
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div>
      <h2>Vibe Audio Recorder</h2>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop" : "Record"}
      </button>

      {audioURL && (
        <div>
          <h4>Playback</h4>
          <audio src={audioURL} controls />
        </div>
      )}

      {transcript && (
        <div>
          <h4>Transcription</h4>
          <p>{transcript}</p>
        </div>
      )}

      {translation && (
        <div>
          <h4>Translation (Spanish)</h4>
          <p>{translation}</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;