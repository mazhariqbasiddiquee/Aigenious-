import React, { useEffect, useRef, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import ButtonOutline from "./ButtonOutline";

const InterviewPage = () => {
  const videoRef = useRef(null);
  const [isCameraStarted, setCameraStarted] = useState(false);
  const [isCameraStopped, setCameraStopped] = useState(true);
  const [typedText, setTypedText] = useState(""); // Store the typed text here
  const [combinedText, setCombinedText] = useState(""); // Store combined text
  const [token, setToken] = useState(""); // Store the token from local storage

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

  const stopListening = () => {
    SpeechRecognition.abortListening(); // Abort the listening process
    SpeechRecognition.stopListening();
  };

  const startCamera = () => {
    if (!isCameraStarted) {
      setCameraStarted(true);
      setCameraStopped(false);
      stopVideo(); // Stop the previous video if it's playing
      setTimeout(() => getVideo(), 500); // Delay to ensure the previous video is stopped
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

  const { transcript, browserSupportsSpeechRecognition } =
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
    setCombinedText(`${transcript} ${typedText}`);
  }, [transcript, typedText]);

  useEffect(() => {
    // Retrieve the token from local storage
    const storedToken = localStorage.getItem("token");
    console.log(storedToken)
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to send the request to the server
  const sendRequest = async () => {
    console.log(1)
    try {
      if (!token) {
        // Handle the case where the token is not found
        console.error("Token not found in local storage");
        return;
      }

      // Send a POST request to the specified URL with the token in the header
      const response = await fetch(
        "http://localhost:8080/user/generate-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body:JSON.stringify({prompt:combinedText})
        }
      );

      // Check the response status and handle accordingly
      const data=await response.json()
      if (response.ok) {
        // Handle a successful response
        console.log(data.text);
      } else {
        // Handle an error response
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
        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-medium text-black-600 leading-normal">
          Your first question?? <strong>Best!!</strong>.
        </h1>
        <br />
        <div className="camera w-6/12 m-auto">
          <video ref={videoRef}></video>
        </div>
        <br />
        <br />
        <br />
        <br />
        <div className="flex justify-center space-x-4 mt-[-80px]">
          {isCameraStarted === true ? (
            <ButtonOutline onClick={stopVideo}>Stop Camera</ButtonOutline>
          ) : (
            <ButtonOutline onClick={startCamera}>Start Camera</ButtonOutline>
          )}
          <ButtonOutline onClick={startListening}>Start Listening</ButtonOutline>
          <ButtonOutline onClick={stopListening}>Stop Listening</ButtonOutline>
          {/* Send button */}
          <button
            onClick={sendRequest}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Send
          </button>
        </div>
        <br />
        <div
          className="max-w-2xl w-full min-h-[400px] h-auto mx-auto mb-20 p-4 pb-32
          relative resize-none shadow-md bg-white border-[0.5px] border-gray-200
          rounded-lg focus:ring-[0.3px] focus:ring-gray-900"
        >
          {combinedText}
          <input
            type="text"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder="Type here..."
            className="mt-4 p-2 w-full border-[0.5px] border-gray-300 rounded-md focus:outline-none"
          />
        </div>
      </div>
    </>
  );
};

export default InterviewPage;
