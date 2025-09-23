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

export function FeaturedCarousel({ novels }: { novels: Novel[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  if (!novels || novels.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <Carousel
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
                        <div className="md:col-span-2 text-white text-center md:text-left">
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
                                <Link href={`/novels/${novel.id}`} className="inline-block px-8 py-3 rounded-md bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                                    Start Reading
                                </Link>
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
