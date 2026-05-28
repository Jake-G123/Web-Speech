import { useEffect, useState } from "react";

function App() {
  const [text, setText] = useState(
    "Hello! This text is being spoken using the Web Speech API."
  );

  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();

      setVoices(availableVoices);

      // Select first voice by default
      if (availableVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(availableVoices[0]);
      }
    };

    loadVoices();

    // Some browsers load voices asynchronously
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoice]);

  const speak = () => {
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      console.log("Speech started");
    };

    utterance.onend = () => {
      console.log("Speech finished");
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 24,
        fontFamily: "Arial",
      }}
    >
      <h1>Web Speech API Demo</h1>

      <textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 16,
          marginBottom: 16,
        }}
      />

      <div style={{ marginBottom: 16 }}>
        <label>
          Voice:
          <select
            value={selectedVoice?.name || ""}
            onChange={(e) => {
              const voice = voices.find(
                (v) => v.name === e.target.value
              );

              setSelectedVoice(voice);
            }}
            style={{
              marginLeft: 8,
              padding: 6,
            }}
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <button
          onClick={speak}
          style={{
            padding: "10px 16px",
            marginRight: 8,
            cursor: "pointer",
          }}
        >
          Speak
        </button>

        <button
          onClick={stop}
          style={{
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          Stop
        </button>
      </div>
    </div>
  );
}

export default App;