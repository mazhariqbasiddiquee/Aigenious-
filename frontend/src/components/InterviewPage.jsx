import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useEffect, useRef, useState } from "react";
import ButtonOutline from "./ButtonOutline";

const InterviewPage = () => {
  const videoRef = useRef(null);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });

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
        video.play();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getVideo();
  }, [videoRef]);

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
          <ButtonOutline onClick={startListening}>
            Start Listening
          </ButtonOutline>
          <ButtonOutline onClick={SpeechRecognition.stopListening}>
            Stop Listening
          </ButtonOutline>
        </div>
        <br />
        <div
          className="max-w-2xl w-full min-h-[400px] h-auto mx-auto mb-20 p-4 pb-32
          relative resize-none shadow-md bg-white border-[0.5px] border-gray-200
          rounded-lg focus:ring-[0.3px] focus:ring-gray-900"
        >
          {transcript}
        </div>
      </div>
    </>
  );
};

export default InterviewPage;
