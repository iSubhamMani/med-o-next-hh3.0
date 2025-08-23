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
    <div className="min-h-screen py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <Link href="/p/dashboard">
          <Button
            variant="ghost"
            className="mb-4 text-foreground hover:text-primary cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-600 mb-2">
            Med-o-Lens
          </h1>
          <p className="text-emerald-900 text-sm">
            Decode your prescriptions with AI-powered analysis
          </p>
        </div>
      </div>

      {/* Two Panes Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Left Pane - Image Input */}
        <Card className="h-max overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
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
                />
                <span>Prescription</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="medicalDoc"
                  checked={analysisType === "medicalDoc"}
                  onChange={() => setAnalysisType("medicalDoc")}
                />
                <span>Medical Document</span>
              </label>
            </div>

            {/* Upload Area */}
            <div className="flex flex-col items-center border-2 border-dashed border-glass-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
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
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      Click to upload{" "}
                      {analysisType === "prescription"
                        ? "prescription"
                        : "medical document"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      (Supported formats: JPG, PNG, PDF)
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            {/* Image Preview */}
            {selectedImage && analysisType !== "medicalDoc" && (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(selectedImage)}
                    width={500}
                    height={500}
                    alt="Preview"
                    className="w-full max-h-64 object-contain rounded-lg border border-glass-border"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-gray-600/80 cursor-pointer hover:bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !selectedImage}
              className="w-full bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-6 py-3 rounded-lg shadow-lg transition"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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

        {/* Right Pane - Results */}
        <Card
          className={`${analysisResult ? "h-2/3" : "h-full"} overflow-y-auto`}
        >
          <CardHeader>
            <CardTitle className="text-foreground flex justify-between items-center gap-2">
              <span>Analysis Results</span>
              <div className="flex gap-2 items-center">
                {analysisResult &&
                  !analysisResult.error &&
                  !translatedResult && (
                    <button
                      onClick={translatePrescription}
                      className="flex items-center gap-2 text-xs bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition"
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
                      className="flex items-center gap-2 text-xs bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition"
                    >
                      <span>Toggle</span>
                      <Languages className="size-4" />
                    </button>
                  )}
                {analysisResult && !analysisResult.error && (
                  <button
                    onClick={downloadPrescription}
                    className="flex items-center gap-2 text-xs bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition"
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
                <div className="w-16 h-16 mx-auto bg-muted/10 rounded-full flex items-center justify-center mb-4">
                  <FileImage className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Upload a prescription image to see AI analysis results
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-foreground">
                  Analyzing your prescription...
                </p>
                <p className="text-muted-foreground text-sm">
                  This may take a few moments
                </p>
              </div>
            )}

            {analysisResult && !isAnalyzing && !toggleTranslateContent && (
              <div className="my-6">
                {analysisResult.error ? (
                  <p className="text-red-500 text-sm">
                    {analysisResult.errorMessage}
                  </p>
                ) : (
                  <div className="max-w-3xl mx-auto w-full">
                    <div ref={ref} className="space-y-4">
                      {analysisResult.title && (
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                          {analysisResult.title}
                        </h1>
                      )}
                      {analysisResult.sections.map((section, sectionIndex) => (
                        <div
                          key={section.title + sectionIndex}
                          className="space-y-4"
                        >
                          <h2 className="text-2xl font-bold text-gray-800 underline underline-offset-4">
                            {section.title}
                          </h2>
                          {section.items.map((item, itemIndex) => (
                            <Card
                              className="p-6"
                              key={item.medicineName + itemIndex}
                            >
                              <CardTitle>
                                <p className="text-emerald-500 font-bold">
                                  {item.medicineName}
                                </p>
                              </CardTitle>
                              <div className="space-y-4">
                                {item.details.map((detail, detailIndex) => (
                                  <div
                                    className="space-y-2"
                                    key={detail.title + detailIndex}
                                  >
                                    <p className="text-neutral-500 font-semibold text-lg underline underline-offset-4">
                                      {detail.title}:
                                    </p>
                                    {Array.isArray(detail.content) ? (
                                      <ul className="list-disc text-neutral-700 ml-6 space-y-1">
                                        {detail.content.map(
                                          (effect, effectIndex) => (
                                            <li key={effectIndex}>{effect}</li>
                                          )
                                        )}
                                      </ul>
                                    ) : (
                                      <p className="text-neutral-700">
                                        {detail.content}
                                      </p>
                                    )}
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
                  <p className="text-red-500 text-sm">
                    {translatedResult.errorMessage}
                  </p>
                ) : (
                  <div className="max-w-3xl mx-auto w-full">
                    <div ref={ref} className="space-y-4">
                      {translatedResult.title && (
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                          {translatedResult.title}
                        </h1>
                      )}
                      {translatedResult.sections.map(
                        (section, sectionIndex) => (
                          <div
                            key={section.title + sectionIndex}
                            className="space-y-4"
                          >
                            <h2 className="text-2xl font-bold text-gray-800 underline underline-offset-4">
                              {section.title}
                            </h2>
                            {section.items.map((item, itemIndex) => (
                              <Card
                                className="p-6"
                                key={item.medicineName + itemIndex}
                              >
                                <CardTitle>
                                  <p className="text-emerald-500 font-bold">
                                    {item.medicineName}
                                  </p>
                                </CardTitle>
                                <div className="space-y-4">
                                  {item.details.map((detail, detailIndex) => (
                                    <div
                                      className="space-y-2"
                                      key={detail.title + detailIndex}
                                    >
                                      <p className="text-neutral-500 font-semibold text-lg underline underline-offset-4">
                                        {detail.title}:
                                      </p>
                                      {Array.isArray(detail.content) ? (
                                        <ul className="list-disc text-neutral-700 ml-6 space-y-1">
                                          {detail.content.map(
                                            (effect, effectIndex) => (
                                              <li key={effectIndex}>
                                                {effect}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      ) : (
                                        <p className="text-neutral-700">
                                          {detail.content}
                                        </p>
                                      )}
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
