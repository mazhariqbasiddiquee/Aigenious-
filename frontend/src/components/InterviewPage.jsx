import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ButtonOutline from "./ButtonOutline";

const InterviewPage = () => {
  const videoRef = useRef(null);
  const [isCameraStarted, setCameraStarted] = useState(false);
  const [isCameraStopped, setCameraStopped] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [combinedText, setCombinedText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [token, setToken] = useState("");

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    setIsListening(true);
    alert("Listening started");
  };

  const stopListening = () => {
    SpeechRecognition.abortListening();
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  const startCamera = () => {
    if (!isCameraStarted) {
      setCameraStarted(true);
      setCameraStopped(false);
      stopVideo();
      setTimeout(() => getVideo(), 500);
    } else {
      setCameraStarted(false);
      setCameraStopped(true);
      stopVideo();
    }
  };

  const stopVideo = () => {
    const video = videoRef.current;
    if (video && video.srcObject && !isCameraStopped) {
      const tracks = video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
      setCameraStopped(true);
    }
    setCameraStarted(false);
  };

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: 1920,
          height: 1080,
        },
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play().catch((error) => {
          console.error("Error playing video:", error);
        });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (isCameraStarted && !isCameraStopped) {
      getVideo();
    }
  }, [isCameraStarted, isCameraStopped]);

  useEffect(() => {
    // Combine transcript and typed text when either of them changes
    setCombinedText((prevCombinedText) => {
      // Use typedText if it exists, otherwise use transcript
      return typedText || transcript || prevCombinedText;
    });
  }, [transcript, typedText]);

  useEffect(() => {
    // Retrieve the token from local storage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to send the request to the server
  const sendRequest = async () => {
    console.log(combinedText);
    try {
      if (!token) {
        console.error("Token not found in local storage");
        return;
      }

      const response = await fetch(
        "https://gray-wandering-parrot.cyclic.app/user/generate-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt: combinedText }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setResponseText(data.text);
        setTypedText("");
        setIsListening(false);
        setCombinedText("");
        // Reset the transcript
        resetTranscript();
      } else {
        console.error("Request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <>
      <div className="max-w-screen-xl mt-24 px-8 xl:px-16 mx-auto">
        <br />
        <div className="camera w-6/12 m-auto">
          <video ref={videoRef}></video>
        </div>
        <br />
        <br />
        <br />
        <br />
        <div className="flex justify-center space-x-4 mt-[-80px]">
          {isCameraStopped === false ? (
            <ButtonOutline onClick={stopVideo}>Stop Camera</ButtonOutline>
          ) : (
            <ButtonOutline onClick={startCamera}>Start Camera</ButtonOutline>
          )}
          {isListening ? (
            <ButtonOutline onClick={stopListening}>Stop Listening</ButtonOutline>
          ) : (
            <ButtonOutline onClick={startListening}>Start Listening</ButtonOutline>
          )}
          {/* Send button */}
          <ButtonOutline onClick={sendRequest}>Send</ButtonOutline>
        </div>
        <br />
        <div
          className="max-w-2xl w-full min-h-[400px] h-auto mx-auto mb-20 p-4 pb-32
          relative resize-none shadow-md bg-white border-[0.5px] border-gray-200
          rounded-lg focus:ring-[0.3px] focus:ring-gray-900"
        >
          {responseText ? (
            <p className="mb-4">{responseText}</p>
          ) : null}
          <input
            type="text"
            value={typedText}
            onChange={(e) => {
              // Check if the input is not empty before updating the state
              if (e.target.value !== '' || typedText !== '') {
                setTypedText(e.target.value);
              }
            }}
            onKeyDown={(e) => {
              // Allow backspace key if the input is empty or has multiple characters
              if (e.key === 'Backspace' && typedText === '') {
                e.preventDefault();
                resetTranscript(); // Reset transcript when backspace is pressed and input is empty
              }
            }}
            placeholder="Type here..."
            className="mt-4 p-2 w-full border-[0.5px] border-gray-300 rounded-md focus:outline-none"
          />
        </div>
      </div>
    </>
  );
};

export default InterviewPage;
