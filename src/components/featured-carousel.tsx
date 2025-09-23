"use client";

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { Novel } from "@/lib/types"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { NovelCard } from "./novel-card"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export function FeaturedCarousel({ novels }: { novels: Novel[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )
  const [api, setApi] = React.useState<any>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap())

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    
    return () => {
      api.off("select", onSelect)
    }
  }, [api])


  if (!novels || novels.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {novels.map((novel, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="overflow-hidden">
                  <CardContent className="relative flex aspect-video items-center justify-center p-0">
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <Image
                      src={novel.coverImageUrl}
                      alt={`Background for ${novel.title}`}
                      fill
                      className="object-cover object-center blur-sm scale-110"
                    />
                    <div className="z-20 grid grid-cols-1 md:grid-cols-3 items-center gap-8 p-8 max-w-6xl mx-auto">
                        <div className="hidden md:block md:col-span-1">
                            <NovelCard novel={novel} isCarouselItem={true} />
                        </div>
                        <div className={cn(
                            "md:col-span-2 text-white text-center md:text-left transition-all duration-700",
                            current === index ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                          )}>
                            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-pretty shadow-lg">
                                {novel.title}
                            </h2>
                            <p className="mt-2 text-lg text-muted-foreground text-white/80 line-clamp-3 text-pretty shadow-sm">
                                {novel.description}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                                {novel.tags.slice(0, 4).map(tag => (
                                    <Badge key={tag} variant="secondary" className="backdrop-blur-sm bg-white/20 border-none">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                            <div className="mt-6">
                                <Button asChild size="lg">
                                    <Link href={`/novels/${novel.id}`} className="inline-block rounded-md font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/30">
                                        Empezar a Leer
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:inline-flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:inline-flex" />
      </Carousel>
    </section>
  )
}
