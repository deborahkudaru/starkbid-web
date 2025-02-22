"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"

const ethIcon = "/logo/ethereum-logo.svg"

// Add this CSS
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

interface NFTCollection {
  id: number
  name: string
  image: string
  floorPrice: string
  totalVolume: string
}

const collections: NFTCollection[] = [
  {
    id: 1,
    name: "Daki Da",
    image: "/nft-collection/DakiDa.svg",
    floorPrice: "0.12 ETH",
    totalVolume: "207 ETH",
  },
  {
    id: 2,
    name: "Birds of Damascus",
    image: "/nft-collection/damascus.svg",
    floorPrice: "0.12 ETH",
    totalVolume: "207 ETH",
  },
  {
    id: 3,
    name: "Birds of Damascus",
    image: "/nft-collection/damascus2.svg",
    floorPrice: "0.12 ETH",
    totalVolume: "207 ETH",
  },
  {
    id: 4,
    name: "Birds of Damascus",
    image: "/nft-collection/damascus3.svg",
    floorPrice: "0.12 ETH",
    totalVolume: "207 ETH",
  },
  {
    id: 5,
    name: "Birds of Damascus",
    image: "/nft-collection/damascus4.jpeg",
    floorPrice: "0.12 ETH",
    totalVolume: "207 ETH",
  },
]

export default function TrendingSection() {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const startDragging = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
    if ("touches" in e) {
      setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0))
    } else {
      setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0))
    }
    setScrollLeft(carouselRef.current?.scrollLeft || 0)
  }, [])

  const stopDragging = useCallback(() => {
    setIsDragging(false)
  }, [])

  const onDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (!isDragging) return
      e.preventDefault()
      const x =
        "touches" in e
          ? e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0)
          : e.pageX - (carouselRef.current?.offsetLeft || 0)
      const walk = (x - startX) * 2
      if (carouselRef.current) {
        carouselRef.current.scrollLeft = scrollLeft - walk
      }
    },
    [isDragging, startX, scrollLeft],
  )

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  useEffect(() => {
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("touchstart", startDragging as any)
      carousel.addEventListener("touchend", stopDragging)
      carousel.addEventListener("touchmove", onDrag as any)
    }
    return () => {
      if (carousel) {
        carousel.removeEventListener("touchstart", startDragging as any)
        carousel.removeEventListener("touchend", stopDragging)
        carousel.removeEventListener("touchmove", onDrag as any)
      }
    }
  }, [startDragging, stopDragging, onDrag])

  return (
    <>
      <style jsx global>
        {scrollbarHideStyles}
      </style>
      <div className="relative py-8 px-8">
        <div className="w-full flex items-center justify-between flex-row mb-9">
          <h1 className="text-[22px] font-bold leading-6 text-white mb-6">Trending in Gaming</h1>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="bg-[#FFFFFF33] p-2 w-12 h-12 rounded-lg text-white hover:bg-[#FFFFFF44] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-[#FFFFFF33] p-2 w-12 h-12 rounded-lg text-white hover:bg-[#FFFFFF44] transition-colors"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div
          ref={carouselRef}
          className="overflow-x-scroll scrollbar-hide"
          onMouseDown={startDragging}
          onMouseLeave={stopDragging}
          onMouseUp={stopDragging}
          onMouseMove={onDrag}
        >
          <div className="flex py-4 px-4 gap-4 w-max">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="flex-none w-[243px] md:w-[300px] transition-transform duration-200 hover:scale-[1.02]"
              >
                <div className="bg-[#FFFFFF1A] w-[241px] h-[276px] md:w-[298px] md:h-[336px] cursor-grab active:cursor-grabbing rounded-xl overflow-hidden">
                  <div className="w-full h-[66%] relative">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm md:text-lg mb-3">{collection.name}</h3>
                    <div className="flex items-center w-full gap-[41px]">
                      <div>
                        <p className="text-[#FFFFFF99] text-xs md:text-sm font-medium mb-1">Floor Price</p>
                        <p className="text-white text-xs md:text-sm font-medium">{collection.floorPrice}</p>
                      </div>
                      <div>
                        <p className="text-[#FFFFFF99] text-xs md:text-sm font-medium mb-1">Total Volume</p>
                        <div className="flex flex-row items-center gap-2">
                          <Image
                            src={ethIcon || "/placeholder.svg"}
                            alt="ethereum"
                            width={100}
                            height={100}
                            className="w-[17.16px] h-[17.16px] object-contain"
                          />
                          <p className="text-white text-xs md:text-sm font-medium">{collection.totalVolume}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

