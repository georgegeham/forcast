"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import Shuffle from "@/components/Shuffle";
import SplitText from "@/components/SplitText";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

function HeroSection() {
  const [animation, setAnimation] = useState(false);
  const colorLayerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const textContainerRef = useRef(null);
  const buttonRef = useRef(null);
  const router = useRouter();
  useGSAP(
    () => {
      if (!animation) return;

      const tl = gsap.timeline();

      tl.fromTo(
        imageWrapperRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.1, ease: "power2.inOut" },
      )
        .fromTo(
          imageWrapperRef.current,
          { clipPath: "inset(45% 45% 45% 45% round 32px)", opacity: 1 },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 0.8,
            ease: "power3.inOut",
          },
          "=",
        )
        .fromTo(
          buttonRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        );

      return () => tl.kill();
    },
    { dependencies: [animation] },
  );

  const handleColorReveal = () => {
    gsap.to(colorLayerRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1.2,
      ease: "power4.inOut",
    });
  };

  const handleColorHide = () => {
    gsap.to(colorLayerRef.current, {
      clipPath: "inset(0% 100% 0% 0%)",
      duration: 1.2,
      ease: "power3.inOut",
    });
  };

  const handleNavigation = () => {
    setAnimation(false);
    router.push("/signup");
  };

  return (
    <section className="relative h-screen w-screen overflow-hidden">
      <div
        ref={imageWrapperRef}
        className="absolute inset-0 opacity-0"
        style={{ filter: "grayscale(1)" }}
      >
        <Image
          src="/placeholder.jpg"
          alt="cast"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div
        ref={colorLayerRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(0% 100% 0% 0%)" }}
      >
        <Image
          src="/placeholder.jpg"
          alt="cast"
          fill
          priority
          className="object-cover"
        />
      </div>

      <div className="relative z-20 flex flex-col h-full items-center justify-center font-oswald">
        <div
          className="flex flex-col gap-2 p-6 flex-2 items-center justify-center"
          ref={textContainerRef}
        >
          <Shuffle
            text="Curtain Call"
            shuffleDirection="right"
            duration={0.4}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.1}
            triggerOnce={true}
            triggerOnHover={false}
            respectReducedMotion={true}
            loop={false}
            loopDelay={0}
            onShuffleComplete={undefined}
            colorFrom={undefined}
            colorTo={undefined}
            className="tracking-widest"
          />
          <SplitText
            text="Stories preserved beyond the stage."
            className="text-2xl italic text-center pt-2"
            delay={50}
            duration={1.1}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={() => setAnimation(true)}
          />
        </div>

        <div className="pb-20" ref={buttonRef} style={{ opacity: 0 }}>
          <Button
            type="button"
            className="p-3 tracking-wider cursor-pointer hover:bg-violet-500 group"
            size="lg"
            onMouseEnter={handleColorReveal}
            onMouseLeave={handleColorHide}
            onTouchStart={handleColorReveal}
            onTouchEnd={handleColorHide}
            onClick={handleNavigation}
          >
            <Plus className="transition-transform duration-200 ease-in-out group-hover:rotate-90" />
            Join Us
          </Button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
