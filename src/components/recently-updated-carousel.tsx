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
import Link from "next/link"
import { NovelCard } from "./novel-card"

export function RecentlyUpdatedCarousel({ novels }: { novels: Novel[] }) {
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  )

  if (!novels || novels.length === 0) {
    return null;
  }

  return (
    <section className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Actualizadas Recientemente</h2>
        <Link href="/?q=" className="text-sm font-medium text-primary hover:underline">
            Ver todo
        </Link>
      </div>
       <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="-ml-4">
          {novels.map((novel, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/3 lg:basis-1/5">
              <div className="p-1">
                <NovelCard novel={novel} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 hidden md:inline-flex" />
        <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 hidden md:inline-flex" />
      </Carousel>
    </section>
  )
}
