let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];

export const startRecording = (
  setRecording: (isRecording: boolean) => void,
  onTranscription: (audioBlob: Blob) => void
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      reject(new Error("Browser does not support audio recording."));
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };
        mediaRecorder.onstop = () => {
          if (audioChunks.length === 0) {
            reject(new Error("No audio recorded. Please try again."));
            return;
          }
          const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          audioChunks = [];
          onTranscription(audioBlob);
        };
        mediaRecorder.start();
        setRecording(true);
        resolve();
      })
      .catch((error) => {
        console.error("Microphone access error:", error);

        if (error.name === "NotAllowedError") {
          reject(
            new Error(
              "Microphone access denied. Please enable it in browser settings."
            )
          );
        } else if (error.name === "NotFoundError") {
          reject(new Error("No microphone found. Please check your device."));
        } else if (error.name === "AbortError") {
          reject(
            new Error("Microphone access aborted. Please reload and try again.")
          );
        } else {
          reject(
            new Error(
              "Failed to access microphone. Please check your permissions."
            )
          );
        }
      });
  });
};

export const stopRecording = (
  setRecording: (isRecording: boolean) => void
): void => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    setRecording(false);
  }
};
