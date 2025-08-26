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
    dob: "",
    gender: "male",
    height: "",
    weight: "",
    disease: "",
  });
  const [age, setAge] = useState<number | null>(null);
  const [height, setHeight] = useState({ feet: "", inches: "" });

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setHeight((prev) => ({ ...prev, [name]: value }));

    const feet = name === "feet" ? parseFloat(value) || 0 : parseFloat(height.feet) || 0;
    const inches = name === "inches" ? parseFloat(value) || 0 : parseFloat(height.inches) || 0;

    const totalInches = (feet * 12) + inches;
    const cm = totalInches * 2.54;
    setUserInfo((prev) => ({ ...prev, height: cm.toString() }));
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    setUserInfo((prev) => ({ ...prev, dob }));
    const birthDate = new Date(dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    setAge(calculatedAge);
  };
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
      !age ||
      userInfo.dob === "" ||
      userInfo.gender === "" ||
      userInfo.height === "" ||
      userInfo.weight === "" ||
      userInfo.disease === ""
    )
      return;

    setLoading(true);

    const formData = new FormData();
    formData.append("age", age.toString());
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

  const [suggestions, setSuggestions] = useState<string[]>([]);

  const diseaseSuggestions = [
    "Acne",
    "Allergy",
    "Anemia",
    "Anxiety",
    "Arthritis",
    "Asthma",
    "Back Pain",
    "Bronchitis",
    "Cavity",
    "Chickenpox",
    "Cold",
    "Constipation",
    "Cough",
    "COVID-19",
    "Dandruff",
    "Dehydration",
    "Depression",
    "Diabetes",
    "Diarrhea",
    "Ear Infection",
    "Eczema",
    "Eye Infection",
    "Fever",
    "Flu",
    "Food Poisoning",
    "Gallstones",
    "Gastritis",
    "GERD",
    "Gout",
    "Hair Loss",
    "Hay Fever",
    "Headache",
    "Heartburn",
    "Hemorrhoids",
    "Hepatitis A",
    "Hepatitis B",
    "High Blood Pressure",
    "High Cholesterol",
    "Hypertension",
    "Hyperthyroidism",
    "Hypothyroidism",
    "Indigestion",
    "Influenza",
    "Insomnia",
    "Irritable Bowel Syndrome",
    "Itching",
    "Jaundice",
    "Kidney Infection",
    "Kidney Stones",
    "Lactose Intolerance",
    "Laryngitis",
    "Low Blood Pressure",
    "Low Blood Sugar",
    "Malaria",
    "Measles",
    "Migraine",
    "Mouth Ulcer",
    "Mumps",
    "Nausea",
    "None",
    "Obesity",
    "Osteoarthritis",
    "Piles",
    "Pneumonia",
    "Psoriasis",
    "Rheumatoid Arthritis",
    "Ringworm",
    "Sinusitis",
    "Skin Allergy",
    "Skin Infection",
    "Sore Throat",
    "Stomach Ache",
    "Stomach Ulcer",
    "Stress",
    "Stroke",
    "Throat Infection",
    "Thyroid Disorder",
    "Tonsillitis",
    "Toothache",
    "Tuberculosis",
    "Typhoid",
    "Ulcer",
    "Urinary Tract Infection",
    "Vertigo",
    "Viral Fever",
    "Vitiligo",
    "Vomiting",
    "Weakness",
    "Whooping Cough",
    "Worm Infestation",
    "Yellow Fever"
  ];


  const handleDiseaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInfo((prev) => ({ ...prev, disease: value }));
    const lastTerm = value.split(",").pop()?.trim();
    if (lastTerm && lastTerm.length >= 3) {
      const filteredSuggestions = diseaseSuggestions.filter((disease) =>
        disease.toLowerCase().includes(lastTerm.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
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
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-2">
            Med-o-Coach
          </h1>
          <p className="text-neutral-300 text-sm">
            Get personalized health recommendations based on your health data
          </p>
        </div>
      </div>
      {result && (
        <div className="flex gap-2 items-center justify-center">
          {result && !translatedResult && (
            <Button
              onClick={translate}
              variant="outline"
              size="sm"
              className="border-emerald-700 bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-200 hover:text-white"
            >
              {loading ? (
                                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              ) : (
                <>
                  <Languages className="size-4 mr-2" />
                  Translate
                </>
              )}
            </Button>
          )}
          {result && translatedResult && (
            <Button
              onClick={toggleTranslation}
              variant="outline"
              size="sm"
              className="border-emerald-700 bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-200 hover:text-white"
            >
              <Languages className="size-4 mr-2" />
              Toggle
            </Button>
          )}
          {result && (
            <Button
              onClick={downloadRecommendation}
              variant="outline"
              size="sm"
              className="border-emerald-700 bg-emerald-900/30 hover:bg-emerald-800/50 text-emerald-200 hover:text-white"
            >
              <Download className="size-4 mr-2" />
              Download
            </Button>
          )}
        </div>
      )}
      {!result && (
        <form className="mt-12 max-w-2xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label htmlFor="dob" className="text-sm text-neutral-400 ml-2 mb-1">Date of Birth</label>
              <Input
                id="dob"
                value={userInfo.dob}
                onChange={handleDobChange}
                className="px-6 py-6 w-full rounded-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-neutral-400"
                type="date"
                max={new Date().toISOString().split("T")[0]}
              />
              {age !== null && <p className="text-sm text-neutral-400 mt-1 ml-2">Your age is {age} years</p>}
            </div>

            <div className="flex flex-col">
              <label htmlFor="gender" className="text-sm text-neutral-400 ml-2 mb-1">Gender</label>
              <Select
                value={userInfo.gender}
                onValueChange={(value) =>
                  setUserInfo((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger id="gender" className="px-6 py-6 w-full rounded-full bg-slate-800/50 border border-slate-700 text-white">
                  <SelectValue placeholder="Choose gender" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-700">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <label htmlFor="height" className="text-sm text-neutral-400 ml-2 mb-1">Height</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  id="feet"
                  name="feet"
                  value={height.feet}
                  onChange={handleHeightChange}
                  className="px-6 py-6 w-full rounded-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-neutral-400"
                  type="number"
                  min={0}
                  placeholder="Feet"
                />
                <Input
                  id="inches"
                  name="inches"
                  value={height.inches}
                  onChange={handleHeightChange}
                  className="px-6 py-6 w-full rounded-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-neutral-400"
                  type="number"
                  min={0}
                  max={11}
                  placeholder="Inches"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="weight" className="text-sm text-neutral-400 ml-2 mb-1">Weight (in kg)</label>
              <Input
                id="weight"
                value={userInfo.weight}
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    weight: e.target.value,
                  }))
                }
                className="px-6 py-6 w-full rounded-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-neutral-400"
                type="number"
                min={1}
                placeholder="Your Weight (in kg)"
              />
            </div>
            <div className="md:col-span-2 relative">
              <label htmlFor="disease" className="text-sm text-neutral-400 ml-2 mb-1">Disease(s)</label>
              <Input
                id="disease"
                value={userInfo.disease}
                onChange={handleDiseaseChange}
                className="px-6 py-6 w-full rounded-full bg-slate-800/50 border border-slate-700 text-white placeholder:text-neutral-400"
                type="text"
                maxLength={100}
                placeholder="Enter disease(s), separated by commas"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-slate-700 border border-slate-600 rounded-md mt-1 w-full">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-slate-600"
                      onClick={() => {
                        const currentDiseases = userInfo.disease.split(',').map(d => d.trim()).filter(d => d);
                        if (!currentDiseases.includes(suggestion)) {
                          setUserInfo((prev) => ({ ...prev, disease: [...currentDiseases, suggestion].join(', ') }));
                        }
                        setSuggestions([]);
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                submitData();
              }}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-teal-600 transition-all duration-300"
            >
              {loading ? (
                                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              ) : (
                "Get Recommendation"
              )}
            </Button>
          </div>
        </form>
      )}
      {result && !toggleTranslateContent && (
        <div className="w-full max-w-5xl mx-auto my-6">
          <div ref={ref}>
            <Card className="p-6 bg-slate-800/50 backdrop-blur-lg border border-emerald-800/60">
              <CardTitle className="text-2xl text-white font-bold">
                {result.title}
              </CardTitle>
              <CardDescription className="text-neutral-300 text-base">
                {result.introduction}
              </CardDescription>
              <div>
                {result.sections.map((section, index) => (
                  <div key={index} className="my-4">
                    <h1 className="text-xl font-bold bg-emerald-900/50 text-emerald-300 px-4 py-1 w-max rounded-md">
                      {section.title}
                    </h1>
                    {section.items.map((item, index) => (
                      <div key={index} className="my-4">
                        <h2 className="text-lg font-semibold text-emerald-400 underline underline-offset-4">
                          {item.subtitle}
                        </h2>
                        <p className="text-neutral-300 text-base mt-2">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="my-2">
                <p className="text-red-400">* {result.note}</p>
              </div>
            </Card>
          </div>
        </div>
      )}
      {translatedResult && toggleTranslateContent && (
        <div className="w-full max-w-5xl mx-auto my-6">
          <div ref={ref}>
            <Card className="p-6 bg-slate-800/50 backdrop-blur-lg border border-emerald-800/60">
              <CardTitle className="text-2xl text-white font-bold">
                {translatedResult.title}
              </CardTitle>
              <CardDescription className="text-neutral-300 text-base">
                {translatedResult.introduction}
              </CardDescription>
              <div>
                {translatedResult.sections.map((section, index) => (
                  <div key={index} className="my-4">
                    <h1 className="text-xl font-bold bg-emerald-900/50 text-emerald-300 px-4 py-1 w-max rounded-md">
                      {section.title}
                    </h1>
                    {section.items.map((item, index) => (
                      <div key={index} className="my-4">
                        <h2 className="text-lg font-semibold text-emerald-400 underline underline-offset-4">
                          {item.subtitle}
                        </h2>
                        <p className="text-neutral-300 text-base mt-2">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className="my-2">
                <p className="text-red-400">* {translatedResult.note}</p>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coach;
