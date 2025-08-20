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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toPng } from "html-to-image";

interface AnalysisResult {
  title: string;
  error: boolean;
  errorMessage: string;
  medicines: {
    name: string;
    details: {
      uses: string;
      sideEffects: string[];
      safetyAdvice: string;
    };
  }[];
}

const MedLens = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string>("");

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

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);

    const fd = new FormData();
    fd.append("imgFile", selectedImage);

    try {
      const res = await axios.post("/api/lens", fd);

      if (res.data) {
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
              Upload Prescription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div className="flex flex-col items-center border-2 border-dashed border-glass-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Input
                type="file"
                accept="image/*"
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
                      Click to upload prescription
                    </p>
                    <p className="text-muted-foreground text-sm">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </Label>
            </div>

            {/* Image Preview */}
            {selectedImage && (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={URL.createObjectURL(selectedImage)}
                    width={500}
                    height={500}
                    alt="Prescription preview"
                    className="w-full max-h-64 object-contain rounded-lg border border-glass-border"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-gray-600/80 cursor-pointer hover:bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <Button
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
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
                      Analyze Prescription
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Pane - Results */}
        <Card
          className={`${analysisResult ? "h-2/3" : "h-full"} overflow-y-auto`}
        >
          <CardHeader>
            <CardTitle className="text-foreground flex justify-between items-center gap-2">
              <span>Analysis Results</span>
              {analysisResult && !analysisResult.error && (
                <button
                  onClick={downloadPrescription}
                  className="flex items-center gap-2 text-xs bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition"
                >
                  <span>Download Summary</span>
                  <Download className="size-4" />
                </button>
              )}
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

            {analysisResult && (
              <div className="my-6">
                {analysisResult && (
                  <div className="max-w-3xl mx-auto w-full">
                    <div ref={ref} className="space-y-4">
                      {analysisResult.medicines.map((medicine) => (
                        <Card className="p-6" key={medicine.name}>
                          <CardTitle>
                            <p className="text-emerald-500 font-bold">
                              {medicine.name}
                            </p>
                          </CardTitle>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <p className="text-neutral-500 font-semibold text-lg underline underline-offset-4">
                                Uses:
                              </p>
                              <p>
                                <span className="text-neutral-700">
                                  {medicine.details.uses}
                                </span>
                              </p>
                            </div>
                            <div className="space-y-2">
                              <p className="text-neutral-500 font-semibold text-lg underline underline-offset-4">
                                Side Effects:
                              </p>
                              <ul className="">
                                {medicine.details.sideEffects.map((effect) => (
                                  <li
                                    className="list-disc text-neutral-700 ml-6"
                                    key={effect}
                                  >
                                    {effect}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="space-y-2">
                              <p className="text-neutral-500 font-semibold text-lg underline underline-offset-4">
                                Safety Advice:
                              </p>
                              <p>
                                <span className="text-neutral-700">
                                  {medicine.details.safetyAdvice}
                                </span>
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedLens;
