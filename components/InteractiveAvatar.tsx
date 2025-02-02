"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  Select,
  Button,
  Tooltip,
  Divider,
  Spinner,
  CardBody,
  SelectItem,
  CardFooter,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { Microphone, Play } from "@phosphor-icons/react";

import { Presenter, Voice } from "@/types";
import { transcribeAudio } from "@/utils/openai";
import { TextInput } from "@/components/TextInput";
import { AvatarVideo } from "@/components/AvatarVideo";
import { useErrorHandler } from "@/utils/useErrorHandler";
import { speakWithAvatar } from "@/utils/speakWithAvatar";
import { startRecording, stopRecording } from "@/utils/audioRecording";
import Image from "next/image";
import clsx from "clsx";

interface InteractiveAvatarProps {
  pdfContent: string; // PDF URL passed as a prop
};

export function InteractiveAvatar({ pdfContent }: InteractiveAvatarProps) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState({
    chat: false,
    reading: false, // Loading state for reading PDF
    presenters: true,
    voices: true,
  });
  const [chatText, setChatText] = useState("");
  const [avatarId, setAvatarId] = useState("");
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [voiceId, setVoiceId] = useState("iP95p4xoKVk53GoZ742B"); // Default: Elevenlabs > Chris
  const [voices, setVoices] = useState<Voice[]>([]);
  const [presenters, setPresenters] = useState<Presenter[]>([]);
  const [pdfText, setPdfText] = useState<string>(""); // State to store extracted PDF text

  const { error, setError, clearError } = useErrorHandler();

  const fetchVoices = useCallback(async () => {
    try {
      const response = await fetch("/api/voices");

      if (!response.ok) {
        throw new Error("Failed to fetch voices");
      }

      const data = await response.json();
      setVoices(data.voices);
    } catch (error) {
      console.error("Error fetching voices:", error);
      setError("Failed to fetch voices. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, voices: false }));
    }
  }, []);

  const fetchPresenters = useCallback(async () => {
    try {
      const response = await fetch("/api/presenters");

      if (!response.ok) {
        throw new Error("Failed to fetch presenters");
      }

      const data: Presenter[] = await response.json();
      setPresenters(data);

      const initialPresenter = data.find((p) => p.name === "matt") || data[0];
      setAvatarId(initialPresenter.presenter_id);
    } catch (err) {
      console.error("Error fetching presenters:", err);
      setError("Failed to fetch presenters. Please try again.");
    } finally {
      setIsLoading((prev) => ({ ...prev, presenters: false }));
    }
  }, []);

  useEffect(() => {
    fetchVoices();
    fetchPresenters();
  }, []);

  useEffect(() => {
    setVideoUrl(null);
  }, [avatarId]);

  // Fetch PDF text from the API route
  useEffect(() => {
    if (pdfContent) {
      setIsLoading((prev) => ({ ...prev, reading: true }));
      fetch("/api/parse-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfUrl: pdfContent }),
      })
        .then((response) => response.json())
        .then((data) => {
          setPdfText(data.text);
          clearError();
        })
        .catch((err) => {
          console.error("Error fetching PDF text:", err);
          setError("Failed to load PDF content. Please try again.");
        })
        .finally(() => {
          setIsLoading((prev) => ({ ...prev, reading: false }));
        });
    }
  }, []);

  // Function to handle reading the PDF content
  const handleReadPdf = async () => {
    if (!pdfText) {
      setError("No PDF content available to read.");
      return;
    }

    setIsLoading((prev) => ({ ...prev, reading: true }));

    try {
      const selectedPresenter = presenters.find(
        (p) => p.presenter_id === avatarId
      );

      if (!selectedPresenter) {
        setError("Selected presenter not found");
        return;
      }

      // Speak the PDF content using the avatar
      const result = await speakWithAvatar({
        text: pdfText,
        presenterId: selectedPresenter.presenter_id,
        voiceId,
        bgColor: theme === "dark" ? "#18181b" : "#F3F4F6",
      });

      if (!result.result_url) {
        throw new Error("Failed to get video URL from D-ID");
      }

      setVideoUrl(result.result_url);
      clearError();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to make avatar speak"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, reading: false }));
    }
  };

  async function handleChatSubmit(userInput: string) {
    if (!userInput.trim()) {
      setError("Please enter text to send to Gemini");
      return;
    }

    setIsLoading((prev) => ({ ...prev, chat: true }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: userInput }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get Gemini response");
      }

      const data = await response.json();
      await handleSpeakWithAvatar(data.response); // Make the avatar speak the response
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading((prev) => ({ ...prev, chat: false }));
      setChatText("");
    }
  }

  async function handleSpeakWithAvatar(text: string) {
    try {
      const selectedPresenter = presenters.find(
        (p) => p.presenter_id === avatarId
      );

      if (!selectedPresenter) {
        setError("Selected presenter not found");
        return;
      }

      const result = await speakWithAvatar({
        text,
        presenterId: selectedPresenter.presenter_id,
        voiceId,
        bgColor: theme === "dark" ? "#18181b" : "#F3F4F6",
      });

      if (!result.result_url) {
        throw new Error("Failed to get video URL from D-ID");
      }

      setVideoUrl(result.result_url);
      clearError();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to make avatar speak"
      );
    }
  }

  async function handleStartRecording() {
    try {
      await startRecording(setRecording, handleTranscription);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to start recording. Please check your microphone permissions."
      );
    }
  }

  function handleStopRecording() {
    stopRecording(setRecording);
  }

  async function handleTranscription(audioBlob: Blob) {
    try {
      const transcription = await transcribeAudio(audioBlob);
      if (!transcription)
        throw new Error("Received empty transcription from Gemini API.");

      setChatText(transcription);
      clearError();
      await handleChatSubmit(transcription); // Send transcribed text to Gemini
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to transcribe audio. Please try again."
      );
    }
  }

  const selectedPresenter = presenters.find((p) => p.presenter_id === avatarId);
  const isAnyLoading = Object.values(isLoading).some(Boolean);

  return (
    <div className="w-full flex flex-col gap-4">
      <Card>
        <CardBody className="h-[400px] flex flex-col justify-center items-center bg-gray-100 dark:bg-[#1B191D]">
          <div className="h-[400px] w-[700px] justify-center items-center flex rounded-lg overflow-hidden relative">
            {isLoading.presenters ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : videoUrl ? (
              <AvatarVideo videoUrl={videoUrl} />
            ) : selectedPresenter ? (
              <Image
                src={selectedPresenter.image_url}
                alt={selectedPresenter.name}
                className="w-full h-full rounded-lg object-contain"
                fill
              />
            ) : null}
          </div>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-2 w-full">
            <Select
              label=""
              placeholder="Choose an avatar"
              selectedKeys={avatarId ? [avatarId] : []}
              onChange={(e) => setAvatarId(e.target.value)}
              className="flex-1"
              isDisabled={isLoading.presenters}
            >
              {presenters.map((presenter) => (
                <SelectItem
                  key={presenter.presenter_id}
                  value={presenter.presenter_id}
                >
                  {presenter.name}
                </SelectItem>
              ))}
            </Select>
            <Select
              placeholder="Choose a voice"
              selectedKeys={voiceId ? [voiceId] : []}
              onChange={(e) => setVoiceId(e.target.value)}
              className="flex-1"
              isDisabled={isLoading.voices}
            >
              {voices.map((voice) => (
                <SelectItem key={voice.voice_id} value={voice.voice_id}>
                  {voice.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          {/* Button to read the PDF content */}
          <Button
            onPress={handleReadPdf}
            disabled={isAnyLoading || !pdfText}
            isLoading={isLoading.reading}
            className="mt-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white"
          >
            {isLoading.reading ? "Reading..." : "Read Chapter PDF"}
          </Button>
          {/* Text input for chatting with Gemini */}
          <TextInput
            label=""
            placeholder="Ask a question about the chapter"
            input={chatText}
            onSubmit={() => handleChatSubmit(chatText)}
            setInput={setChatText}
            loading={isLoading.chat}
            disabled={isAnyLoading}
            endContent={
              <Tooltip
                content={!recording ? "Start recording" : "Stop recording"}
              >
                <Button
                  isIconOnly
                  className={clsx(
                    "mr-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
                    recording && "animate-pulse"
                  )}
                  onPress={
                    !recording ? handleStartRecording : handleStopRecording
                  }
                  disabled={isAnyLoading}
                >
                  {recording ? (
                    <Play size={20} weight="fill" className="text-white" />
                  ) : (
                    <Microphone
                      size={20}
                      weight="fill"
                      className="text-white"
                    />
                  )}
                </Button>
              </Tooltip>
            }
          />
        </CardFooter>
      </Card>

      {error && (
        <p className="text-red-500 font-mono text-right">
          <span className="font-bold">Error:</span> {error}
        </p>
      )}
    </div>
  );
}
