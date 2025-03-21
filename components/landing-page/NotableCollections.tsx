"use client";

import {
  type FC,
  type MouseEvent,
  type TouchEvent,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import TrendingCard from "../TrendingCard";
import { NextIcon, PrevIcon } from "@/public/icons/icons";
import { notableCollections } from "@/data/data";

const NotableCollections: FC = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startDragging = useCallback((e: MouseEvent | TouchEvent) => {
    setIsDragging(true);
    const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
    setStartX(pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);

    if (autoScrollTimeoutRef.current) {
      clearInterval(autoScrollTimeoutRef.current);
    }
  }, []);

  const stopDragging = useCallback(() => setIsDragging(false), []);

  const onDrag = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const pageX = "touches" in e ? e.touches[0].pageX : e.pageX;
      const walk = (pageX - startX) * 2;
      if (carouselRef.current) {
        carouselRef.current.scrollLeft = scrollLeft - walk;
      }
    },
    [isDragging, startX, scrollLeft]
  );

  const scroll = (direction: "left" | "right" | "start") => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 20;

    if (direction === "start" || (direction === "right" && isAtEnd)) {
      scrollToStart();
    } else {
      const scrollAmount = direction === "left" ? -315 : 315;

      const adjustedScrollAmount =
        window.innerWidth <= 640 ? scrollAmount * 0.81 : scrollAmount;

      carouselRef.current.scrollBy({
        left: adjustedScrollAmount,
        behavior: "smooth",
      });
    }

    if (autoScrollTimeoutRef.current) {
      clearInterval(autoScrollTimeoutRef.current);
    }
    setupAutoScroll();
  };

  const scrollToStart = useCallback(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, []);

  const setupAutoScroll = useCallback(() => {
    if (autoScrollTimeoutRef.current) {
      clearInterval(autoScrollTimeoutRef.current);
    }

    autoScrollTimeoutRef.current = setInterval(() => {
      if (carouselRef.current) {
        const scrollAmount = window.innerWidth <= 640 ? 243 : 315;
        carouselRef.current.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, 4000);
  }, []);

  const checkIfEndReached = useCallback(() => {
    if (!carouselRef.current) return false;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

    const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) < 20;

    if (isAtEnd) {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      if (autoScrollTimeoutRef.current) {
        clearInterval(autoScrollTimeoutRef.current);
        autoScrollTimeoutRef.current = null;
      }

      resetTimeoutRef.current = setTimeout(() => {
        scrollToStart();

        setupAutoScroll();
      }, 3000);
    }
  }, [scrollToStart, setupAutoScroll]); // setupAutoScroll is now defined before this function

  useEffect(() => {
    setupAutoScroll();

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkIfEndReached);
    }

    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      if (autoScrollTimeoutRef.current) {
        clearInterval(autoScrollTimeoutRef.current);
      }
      if (carousel) {
        carousel.removeEventListener("scroll", checkIfEndReached);
      }
    };
  }, [checkIfEndReached, setupAutoScroll]);

  return (
    <div className="relative py-8 flex flex-col gap-9  lg:pl-10 xl:pl-20 w-full mx-auto ">
      <div className="w-full flex items-center justify-between flex-row  lg:pr-10 xl:pr-20">
        <h1 className="text-[22px] font-bold leading-6 text-white">
          Notable Collections
        </h1>
        <div className="flex gap-2">
          <div className="gap-2 hidden md:flex">
            <button
              onClick={() => scroll("left")}
              className="bg-[#FFFFFF33] p-2 w-12 h-12 rounded-lg flex items-center justify-center text-white hover:bg-[#FFFFFF44]"
            >
              <PrevIcon />
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-[#FFFFFF33] p-2 w-12 h-12 rounded-lg flex items-center justify-center text-white hover:bg-[#FFFFFF44]"
            >
              <NextIcon />
            </button>
          </div>
        </div>
      </div>
      <motion.div
        ref={carouselRef}
        className="overflow-x-scroll scrollbar-hide flex gap-2 md:gap-4  px-"
        onMouseDown={startDragging}
        onMouseLeave={stopDragging}
        onMouseUp={stopDragging}
        onMouseMove={onDrag}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {notableCollections
          .concat(notableCollections)
          .map((collection, index) => (
            <TrendingCard key={index} {...collection} />
          ))}
      </motion.div>
    </div>
  );
};

export default NotableCollections;
