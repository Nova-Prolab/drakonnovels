"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';

type ExpandableDescriptionProps = {
    description: string;
};

const MAX_LINES = 8; 

export function ExpandableDescription({ description }: ExpandableDescriptionProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const descriptionLines = description.split('\\n');
    const isLongDescription = descriptionLines.length > MAX_LINES;

    return (
        <div className="mt-6">
            <div
                className={cn(
                    "prose prose-lg dark:prose-invert max-w-none font-sans relative overflow-hidden transition-all duration-500 ease-in-out",
                    !isExpanded && isLongDescription ? "max-h-[20rem]" : "max-h-[1000px]"
                )}
            >
                {!isExpanded && isLongDescription && (
                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent" />
                )}
                {descriptionLines.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
            {isLongDescription && (
                <div className="mt-2">
                    <Button variant="link" onClick={toggleExpansion} className="px-0">
                        {isExpanded ? 'Show Less' : 'Show More'}
                        {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                    </Button>
                </div>
            )}
        </div>
    );
}
