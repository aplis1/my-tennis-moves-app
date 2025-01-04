"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Play, Plus } from "lucide-react";

const SpeechApp = () => {
    const [words, setWords] = useState<string[]>([]);
    const [newWord, setNewWord] = useState<string>("");

    const addWord = () => {
        setWords([...words, newWord]);
        setNewWord("");
    }

    const removeWord = (index: number) => {
        setWords(words.filter((_, i) => i !== index));
    }   

    const speakWords = () => {
        if('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(words.join(" "));
            window.speechSynthesis.speak(utterance);
        } else {
            alert("Your browser does not support speech synthesis.");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key === "Enter") {
            addWord();
        }
    }

    return (
       <Card>
        <CardHeader>
            <CardTitle>Word Speaker</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Input value={newWord} onChange={(e) => setNewWord(e.target.value)} onKeyDown={handleKeyPress}
                    placeholder="Enter a Word" className="flex-1"/>
                    <Button onClick={addWord} size="icon">
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            

                <div className="space-y-2">
                    {words.map((word, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span>{word}</span>
                            <Button onClick={() => removeWord(index)} size="icon">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
                {words.length > 0 && (
                    <Button onClick={speakWords} className="w-full" size="lg">
                        <Play className="h-4 w-4 mr-2" />
                        Speak Words
                        </Button>
                )}
            </div>
        </CardContent>
       </Card>
    );
};

export default SpeechApp;