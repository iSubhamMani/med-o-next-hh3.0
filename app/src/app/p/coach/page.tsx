"use client";

import axios from "axios";
import React, { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Languages, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export interface HealthRecommendationContent {
  title: string;
  introduction: string;
  note: string;
  sections: Sections[];
  createdAt?: Date;
}

interface Sections {
  title: string;
  items: Items[];
}

interface Items {
  subtitle: string;
  description: string;
}

const Coach = () => {
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    age: "",
    gender: "male",
    height: "",
    weight: "",
    disease: "",
  });
  const [result, setResult] = useState<HealthRecommendationContent | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const [translatedResult, setTranslatedResult] =
    useState<HealthRecommendationContent | null>(null);
  const [toggleTranslateContent, setToggleTranslateContent] =
    useState<boolean>(false);

  const downloadRecommendation = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${result?.title}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  const submitData = async () => {
    if (
      userInfo.age === "" ||
      userInfo.gender === "" ||
      userInfo.height === "" ||
      userInfo.weight === "" ||
      userInfo.disease === ""
    )
      return;

    setLoading(true);

    const formData = new FormData();
    formData.append("age", userInfo.age);
    formData.append("gender", userInfo.gender);
    formData.append("height", userInfo.height);
    formData.append("weight", userInfo.weight);
    formData.append("disease", userInfo.disease);

    try {
      const res = await axios.post("/api/coach", formData);
      if (res.data.success) {
        setResult(res.data.content);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const translate = async () => {
    try {
      if (!result) return;

      setLoading(true);

      const fd = new FormData();
      fd.append("content", JSON.stringify(result));
      const res = await axios.post("/api/translate", fd);

      if (res.data) {
        if (res.data.content.error) {
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
    } finally {
      setLoading(false);
    }
  };

  const toggleTranslation = () => {
    setToggleTranslateContent(!toggleTranslateContent);
  };

  return (
    <div className="min-h-screen py-8 px-6">
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
            Med-o-Coach
          </h1>
          <p className="text-emerald-900 text-sm">
            Get personalized health recommendations based on your health data
          </p>
        </div>
      </div>
      {result && (
        <div className="flex gap-2 items-center justify-center">
          {result && !translatedResult && (
            <button
              onClick={translate}
              className="flex items-center gap-2 text-xs bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition"
            >
              <span>
                {loading ? (
                  <LoaderCircle className="animate-spin size-4" />
                ) : (
                  "Translate"
                )}
              </span>
              <Languages className="size-4" />
            </button>
          )}
          {result && translatedResult && (
            <button
              onClick={toggleTranslation}
              className="flex items-center gap-2 text-xs bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition"
            >
              <span>Toggle</span>
              <Languages className="size-4" />
            </button>
          )}
          {result && (
            <button
              onClick={downloadRecommendation}
              className="flex items-center gap-2 text-xs bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition"
            >
              <span>Download Recommendation</span>
              <Download className="size-4" />
            </button>
          )}
        </div>
      )}
      {!result && (
        <form className="mt-12 max-w-lg mx-auto w-full space-y-6 flex flex-col items-center">
          <Input
            value={userInfo.age}
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, age: e.target.value }))
            }
            className="px-6 py-6 w-full max-w-sm rounded-full overflow-hidden bg-gray-200 text-neutral-800"
            type="number"
            min={0}
            max={100}
            placeholder="Your age"
          />

          <Select
            value={userInfo.gender}
            onValueChange={(value) =>
              setUserInfo((prev) => ({ ...prev, gender: value }))
            }
          >
            <SelectTrigger className="px-6 py-6 w-full max-w-sm rounded-full overflow-hidden bg-gray-200 text-neutral-800">
              <SelectValue placeholder="Choose gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input
            value={userInfo.disease}
            onChange={(e) =>
              setUserInfo((prev) => ({ ...prev, disease: e.target.value }))
            }
            className="px-6 py-6 w-full max-w-sm rounded-full overflow-hidden bg-gray-200 text-neutral-800"
            type="text"
            maxLength={100}
            placeholder="Any disease? If no, please enter 'none'"
          />
          <Input
            value={userInfo.height}
            onChange={(e) =>
              setUserInfo((prev) => ({
                ...prev,
                height: e.target.value,
              }))
            }
            className="px-6 py-6 w-full max-w-sm rounded-full overflow-hidden bg-gray-200 text-neutral-800"
            type="number"
            min={50}
            max={250}
            placeholder="Your Height (in cm)"
          />
          <Input
            value={userInfo.weight}
            onChange={(e) =>
              setUserInfo((prev) => ({
                ...prev,
                weight: e.target.value,
              }))
            }
            className="px-6 py-6 w-full max-w-sm rounded-full overflow-hidden bg-gray-200 text-neutral-800"
            type="number"
            min={1}
            placeholder="Your Weight (in kg)"
          />
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                submitData();
              }}
              className="flex items-center gap-2 text-xs bg-emerald-900 hover:bg-emerald-800 text-white cursor-pointer px-4 py-2 rounded-lg shadow-lg transition"
            >
              {loading ? (
                <LoaderCircle className="animate-spin size-4" />
              ) : (
                "Get Recommendation"
              )}
            </Button>
          </div>
        </form>
      )}
      {result && !toggleTranslateContent && (
        <div className="w-full max-w-3xl mx-auto my-6">
          <div ref={ref}>
            <Card className="p-6">
              <CardTitle className="text-2xl text-neutral-500 font-bold">
                {result.title}
              </CardTitle>
              <CardDescription className="text-neutral-600 text-base">
                {result.introduction}
              </CardDescription>
              <div>
                {result.sections.map((section, index) => (
                  <div key={index} className="my-4">
                    <h1 className="text-xl font-bold bg-green-200 text-green-800 px-4 w-max rounded-sm">
                      {section.title}
                    </h1>
                    {section.items.map((item, index) => (
                      <div key={index} className="my-4">
                        <h2 className="text-lg font-semibold text-emerald-700 underline underline-offset-4">
                          {item.subtitle}
                        </h2>
                        <p className="text-neutral-600 text-base mt-2">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="my-2">
                <p className="text-red-500">* {result.note}</p>
              </div>
            </Card>
          </div>
        </div>
      )}
      {translatedResult && toggleTranslateContent && (
        <div className="w-full max-w-3xl mx-auto my-6">
          <div ref={ref}>
            <Card className="p-6">
              <CardTitle className="text-2xl text-neutral-500 font-bold">
                {translatedResult.title}
              </CardTitle>
              <CardDescription className="text-neutral-600 text-base">
                {translatedResult.introduction}
              </CardDescription>
              <div>
                {translatedResult.sections.map((section, index) => (
                  <div key={index} className="my-4">
                    <h1 className="text-xl font-bold bg-green-200 text-green-800 px-4 w-max rounded-sm">
                      {section.title}
                    </h1>
                    {section.items.map((item, index) => (
                      <div key={index} className="my-4">
                        <h2 className="text-lg font-semibold text-emerald-700 underline underline-offset-4">
                          {item.subtitle}
                        </h2>
                        <p className="text-neutral-600 text-base mt-2">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="my-2">
                <p className="text-red-500">* {translatedResult.note}</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coach;
