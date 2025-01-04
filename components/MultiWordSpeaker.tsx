"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, Plus } from 'lucide-react';

type ArrayKeys = 'array1' | 'array2' | 'array3';

const MultiWordSpeaker = () => {
    const [inputs, setInputs] = useState({
        array1: '',
        array2: '',
        array3: ''
    });

    const [savedWords, setSavedWords] = useState({
        array1: [],
        array2: [],
        array3: []  
    });

    useEffect(() => {
        //Load saved words from local storage when component mounts
        const stored = localStorage.getItem('savedWords');
        if (stored) {
            setSavedWords(JSON.parse(stored));
        }   
    },[]);

    const handleInputChange = (array: ArrayKeys, value: string) => {
        setInputs(prev => ({
          ...prev,
          [array]: value
        }));
      };

    const addWord = (array:ArrayKeys) => {
        if(inputs[array].trim()) {
            const newWords = {
                ...savedWords,
                [array]: [...savedWords[array], inputs[array].trim()]   
            }
            setSavedWords(newWords);
            localStorage.setItem('savedWords', JSON.stringify(newWords));
            setInputs(prev => ({...prev, [array]: ''}));
        }


    };

    const speakWords = () => {
        if('speechSynthesis' in window) {
            //Helper function to get a random worjd from the array
            const getRandomWord = (array: string | any[]) => {
                return array[Math.floor(Math.random() * array.length)];
            };

            try {
                const word1 = getRandomWord(savedWords.array1);
                const word2 = getRandomWord(savedWords.array2);
                const word3 = getRandomWord(savedWords.array3);

                // Create utterance with selected words
                const utterance = new SpeechSynthesisUtterance(`${word1} ${word2} ${word3}`);

                //Optional: Customize the voice
                //utterance.rate = 1.0;
               // utterance.pitch = 1.0;
                //utterance.volume = 1.0;

               window.speechSynthesis.speak(utterance);

            } catch (error) {
                console.error('Error speaking words:', error);
            }

        } else {
            alert("Sorry, Your browser does not support speech synthesis.");
        }

    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Word Combination Speaker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {(['array1', 'array2', 'array3'] as ArrayKeys[]).map((array, index) => (
                <div key={array} className="space-y-2">
                    <label className="text-sm font-medium">Word List {index + 1}</label>
                    <div className="flex gap-2">
                    <Input
                        value={inputs[array]}
                        onChange={(e) => handleInputChange(array, e.target.value)}
                        onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addWord(array)}
                        placeholder={`Add word to list ${index + 1}`}
                    />
                    <Button onClick={() => addWord(array)} size="icon">
                        <Plus className="h-4 w-4" />
                    </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                    {savedWords[array].map((word, i) => (
                        <span key={i} className="bg-slate-100 px-2 py-1 rounded text-sm">
                        {word}
                        </span>
                    ))}
                    </div>
                </div>
                ))}

                <Button 
                onClick={speakWords} 
                className="w-full" 
                disabled={!Object.values(savedWords).every(arr => arr.length > 0)}
                >
                <Play className="h-4 w-4 mr-2" />
                Speak Random Combination
                </Button>
            </CardContent>
        </Card>
    );
}

export default MultiWordSpeaker;