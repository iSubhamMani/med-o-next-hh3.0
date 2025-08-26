"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Upload,
  Camera,
  FileImage,
  X,
  Download,
  Languages,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toPng } from "html-to-image";

type AnalysisType = "prescription" | "medicalDoc";

interface AnalysisResult {
  title?: string;
  error?: boolean;
  errorMessage?: string;
  sections: {
    title: string;
    items: {
      buyLink: string;
      medicineName: string;
      details: {
        title: string;
        content: string | string[];
      }[];
    }[];
  }[];
}

const MedLens = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [translatedResult, setTranslatedResult] =
    useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");
  const [isError, setIsError] = useState(false);
  const [toggleTranslateContent, setToggleTranslateContent] =
    useState<boolean>(false);
  const [analysisType, setAnalysisType] =
    useState<AnalysisType>("prescription"); // NEW

  const downloadPrescription = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${analysisResult?.title}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  const analyzePrescription = async () => {
    if (!selectedImage) return;

    setError("");
    setIsError(false);
    setIsAnalyzing(true);

    const fd = new FormData();
    fd.append("imgFile", selectedImage);

    try {
      const res = await axios.post("/api/lens", fd);

      if (res.data) {
        if (res.data.content.error) {
          setIsError(true);
          setError(res.data.content.errorMessage);
          setAnalysisResult(res.data.content);
          return;
        }
        setAnalysisResult(res.data.content);
      } else {
        setAnalysisResult(null);
      }
    } catch (error) {
      console.log("Error analyzing image:", error);
      setError(
        "An error occurred while processing the image. Please try again later."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const translatePrescription = async () => {
    try {
      if (isError) return;

      if (!analysisResult) return;

      setIsAnalyzing(true);

      const fd = new FormData();
      fd.append("content", JSON.stringify(analysisResult));
      const res = await axios.post("/api/translate", fd);

      if (res.data) {
        if (res.data.content.error) {
          setIsError(true);
          setError(res.data.content.errorMessage);
          setTranslatedResult(res.data.content);
          setToggleTranslateContent(true);
          return;
        }
        setTranslatedResult(res.data.content);
        setToggleTranslateContent(true);
      } else {
        setTranslatedResult(null);
      }
    } catch (error) {
      console.log(error);
      setError(
        "An error occurred while processing the image. Please try again later."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeMedicalDoc = async () => {
    if (!selectedImage) return;

    setError("");
    setIsError(false);
    setIsAnalyzing(true);

    const fd = new FormData();
    fd.append("imgFile", selectedImage);

    try {
      const res = await axios.post("/api/medicalDoc", fd);

      if (res.data) {
        if (res.data.content.error) {
          setIsError(true);
          setError(res.data.content.errorMessage);
          setAnalysisResult(res.data.content);
          return;
        }
        setAnalysisResult(res.data.content);
      } else {
        setAnalysisResult(null);
      }
    } catch (error) {
      console.log("Error analyzing image:", error);
      setError(
        "An error occurred while processing the image. Please try again later."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = () => {
    if (analysisType === "prescription") {
      analyzePrescription();
    } else {
      analyzeMedicalDoc();
    }
  };

  const toggleTranslation = () => {
    setToggleTranslateContent(!toggleTranslateContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 text-white py-8 px-6">
      <div className="mb-8">
        <Link href="/p/dashboard">
          <Button
            variant="ghost"
            className="mb-4 text-emerald-300 hover:text-emerald-100 cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 rounded-full shadow-lg border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-2 animate-fade-in-down">
            Med-o-Lens
          </h1>
          <p className="text-neutral-300 text-sm animate-fade-in-down animation-delay-200">
            Decode your prescriptions with AI-powered analysis
          </p>
        </div>
      </div>

      {/* Two Panes Layout */}
      <div className="flex flex-col items-center gap-8 w-full px-4">
        {/* Top Pane - Image Input */}
        <Card className="w-full max-w-4xl overflow-y-auto rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-slate-700 ring-1 ring-slate-700/50 animate-fade-in-up">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Upload File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Analysis Type Selection */}
            <div className="flex gap-4 items-center justify-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="prescription"
                  checked={analysisType === "prescription"}
                  onChange={() => setAnalysisType("prescription")}
                  className="form-radio h-4 w-4 text-emerald-600 bg-slate-800 border-slate-600 focus:ring-emerald-500"
                />
                <span className="text-neutral-300">Prescription</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="medicalDoc"
                  checked={analysisType === "medicalDoc"}
                  onChange={() => setAnalysisType("medicalDoc")}
                  className="form-radio h-4 w-4 text-emerald-600 bg-slate-800 border-slate-600 focus:ring-emerald-500"
                />
                <span className="text-neutral-300">Medical Document</span>
              </label>
            </div>

            {/* Upload Area */}
            <div className="flex flex-col items-center border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-emerald-500/50 transition-colors">
              <Input
                type="file"
                accept="*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedImage(file);
                  }
                }}
                className="hidden"
                id="image-upload"
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-neutral-300 font-medium">
                      Click to upload{" "}
                      {analysisType === "prescription"
                        ? "prescription"
                        : "medical document"}
                    </p>
                    <p className="text-neutral-400 text-sm">
                      (Supported formats: JPG, PNG, PDF)
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            {selectedImage && (
              <div className="space-y-4 animate-fade-in-up">
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(selectedImage)}
                    width={500}
                    height={500}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-lg border border-slate-700"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-slate-800/80 cursor-pointer hover:bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedImage}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-teal-600 transition-all duration-300"
            >
              {isAnalyzing ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <FileImage className="w-4 h-4 mr-2" />
                  Analyze{" "}
                  {analysisType === "prescription"
                    ? "Prescription"
                    : "Medical Document"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Bottom Pane - Results */}
        <Card
          className={`${analysisResult ? "w-full max-w-4xl" : "w-full max-w-4xl"} overflow-y-auto rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-slate-700 animate-fade-in-up animation-delay-200`}
        >
          <CardHeader>
            <CardTitle className="text-white flex justify-between items-center gap-2">
              <span>Analysis Results</span>
              <div className="flex gap-2 items-center">
                {analysisResult &&
                  !analysisResult.error &&
                  !translatedResult && (
                    <button
                      onClick={translatePrescription}
                      className="flex items-center gap-2 text-xs bg-slate-800/50 hover:bg-slate-700/50 text-emerald-300 hover:text-emerald-100 cursor-pointer px-4 py-2 rounded-full shadow-lg border border-slate-700 transition"
                    >
                      <span>Translate</span>
                      <Languages className="size-4" />
                    </button>
                  )}
                {analysisResult &&
                  !analysisResult.error &&
                  translatedResult && (
                    <button
                      onClick={toggleTranslation}
                      className="flex items-center gap-2 text-xs bg-slate-800/50 hover:bg-slate-700/50 text-emerald-300 hover:text-emerald-100 cursor-pointer px-4 py-2 rounded-full shadow-lg border border-slate-700 transition"
                    >
                      <span>Toggle</span>
                      <Languages className="size-4" />
                    </button>
                  )}
                {analysisResult && !analysisResult.error && (
                  <button
                    onClick={downloadPrescription}
                    className="flex items-center gap-2 text-xs bg-slate-800/50 hover:bg-slate-700/50 text-emerald-300 hover:text-emerald-100 cursor-pointer px-4 py-2 rounded-full shadow-lg border border-slate-700 transition"
                  >
                    <span>Download Summary</span>
                    <Download className="size-4" />
                  </button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!analysisResult && !isAnalyzing && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                  <FileImage className="w-8 h-8 text-emerald-400" />
                </div>
                <p className="text-neutral-400">
                  Upload a document to see AI analysis results
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <svg
                  className="animate-spin h-12 w-12 text-white mx-auto mb-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-neutral-300">
                  Analyzing your document...
                </p>
                <p className="text-neutral-400 text-sm">
                  This may take a few moments
                </p>
              </div>
            )}

            {analysisResult && !isAnalyzing && !toggleTranslateContent && (
              <div className="my-6">
                {analysisResult.error ? (
                  <p className="text-red-400 text-sm">
                    {analysisResult.errorMessage}
                  </p>
                ) : (
                  <div className="max-w-full mx-auto w-full">
                    <div
                      ref={ref}
                      className="space-y-6 p-4 rounded-lg bg-slate-800/50"
                    >
                      {analysisResult.title && (
                        <h1 className="text-3xl font-bold text-white mb-6 text-center">
                          {analysisResult.title}
                        </h1>
                      )}
                      {analysisResult.sections.map((section, sectionIndex) => (
                        <div
                          key={section.title + sectionIndex}
                          className="space-y-4"
                        >
                          <h2 className="text-2xl font-bold text-emerald-400 underline underline-offset-4">
                            {section.title}
                          </h2>
                          {section.items.map((item, itemIndex) => (
                            <Card
                              className="p-6 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-slate-700"
                              key={item.medicineName + itemIndex}
                            >
                              <CardTitle className="flex items-center justify-between">
                                <p className="text-emerald-300 font-bold text-xl">
                                  {item.medicineName}
                                </p>
                                {item.buyLink !== null && (
                                  <a
                                    target="_blank"
                                    className="text-emerald-400 underline underline-offset-2"
                                    href={item.buyLink}
                                  >
                                    Buy Link
                                  </a>
                                )}
                              </CardTitle>
                              <div className="space-y-4 mt-4">
                                {item.details.map((detail, detailIndex) => (
                                  <div
                                    className="grid grid-cols-1 md:grid-cols-3 gap-2"
                                    key={detail.title + detailIndex}
                                  >
                                    <p className="text-neutral-300 font-semibold">
                                      {detail.title}:
                                    </p>
                                    <div className="md:col-span-2">
                                      {Array.isArray(detail.content) ? (
                                        <ul className="list-disc text-neutral-400 ml-6 space-y-1">
                                          {detail.content.map(
                                            (effect, effectIndex) => (
                                              <li key={effectIndex}>
                                                {effect}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      ) : (
                                        <p className="text-neutral-400">
                                          {detail.content}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {translatedResult && !isAnalyzing && toggleTranslateContent && (
              <div className="my-6">
                {translatedResult.error ? (
                  <p className="text-red-400 text-sm">
                    {translatedResult.errorMessage}
                  </p>
                ) : (
                  <div className="max-w-full mx-auto w-full">
                    <div
                      ref={ref}
                      className="space-y-6 p-4 rounded-lg bg-slate-800/50"
                    >
                      {translatedResult.title && (
                        <h1 className="text-3xl font-bold text-white mb-6 text-center">
                          {translatedResult.title}
                        </h1>
                      )}
                      {translatedResult.sections.map(
                        (section, sectionIndex) => (
                          <div
                            key={section.title + sectionIndex}
                            className="space-y-4"
                          >
                            <h2 className="text-2xl font-bold text-emerald-400 underline underline-offset-4">
                              {section.title}
                            </h2>
                            {section.items.map((item, itemIndex) => (
                              <Card
                                className="p-6 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 border border-slate-700"
                                key={item.medicineName + itemIndex}
                              >
                                <CardTitle className="flex items-center justify-between">
                                  <p className="text-emerald-300 font-bold text-xl">
                                    {item.medicineName}
                                  </p>
                                </CardTitle>
                                <div className="space-y-4 mt-4">
                                  {item.details.map((detail, detailIndex) => (
                                    <div
                                      className="grid grid-cols-1 md:grid-cols-3 gap-2"
                                      key={detail.title + detailIndex}
                                    >
                                      <p className="text-neutral-300 font-semibold">
                                        {detail.title}:
                                      </p>
                                      <div className="md:col-span-2">
                                        {Array.isArray(detail.content) ? (
                                          <ul className="list-disc text-neutral-400 ml-6 space-y-1">
                                            {detail.content.map(
                                              (effect, effectIndex) => (
                                                <li key={effectIndex}>
                                                  {effect}
                                                </li>
                                              )
                                            )}
                                          </ul>
                                        ) : (
                                          <p className="text-neutral-400">
                                            {detail.content}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </Card>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedLens;
