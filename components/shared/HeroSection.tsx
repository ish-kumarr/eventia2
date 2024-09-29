'use client'

import { useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { FaFacebook, FaInstagram, FaEnvelope, FaGooglePlus } from 'react-icons/fa'
import Component from './Badge';

interface SocialButtonProps {
  icon: React.ComponentType<{ size: number }>;
  label: string;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon: Icon, label }) => (
  <Button
    variant="outline"
    className="bg-white/20 border-white text-white hover:bg-white/30 rounded-full w-12 h-12 p-0 transition-colors duration-200"
    aria-label={label}
  >
    <Icon size={24} />
  </Button>
)

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.9;
      videoRef.current.loop = true;
    }
  }, [])

  return (
    <div className="h-[100vh] flex flex-col relative overflow-hidden">
      {/* Video for large and medium devices */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 hidden sm:block"
        aria-hidden="true"
      >
        <source src="\assets\videos\herolg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video for small devices */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 sm:hidden"
        aria-hidden="true"
      >
        <source src="\assets\videos\in-y2mate.com - PIET College shorts youtube celebration college piet haryana explore fyp_1080p.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken the video */}
      <div className="absolute inset-0 bg-black/25 z-10" aria-hidden="true" />

      {/* Main Content */}
      <main className="flex-grow flex lg:ml-16 items-end pb-16 px-4 sm:px-6 lg:px-8 relative z-30">
        <div className="max-w-7xl">
          <Component />
          <h1 className="lg:text-6xl max-w-7xl md:text-7xl sm:text-3xl text-3xl font-bold text-white mb-6 lg:leading-tight">
            Elevate Your Campus Experience, and<br />Grow your Network.
          </h1>
          <p className="lg:text-2xl max-w-2xl sm:text-xl text-white mb-10">
            Your go-to platform for exploring and participating in campus events, make every moment count.
          </p>
          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="w-full sm:w-auto bg-white text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 text-lg py-3 px-6">
              <FaGooglePlus className="mr-2" />
              Sign in with Google
            </Button>
          </div>
        </div>
      </main>

      {/* Gradient Animation */}
      <div
        className="absolute inset-x-0 -bottom-32 h-96 bg-gradient-to-t from-[#ff0050] via-[#cc00ff] via-[#ff00f5] to-[#8000ff] opacity-20 blur-3xl z-20 animate-gradient"
        aria-hidden="true"
      />

      {/* Styles for gradient animation */}
      <style jsx>{`
        @keyframes gradientMove {
          0%, 100% { transform: translateY(30%) scaleY(0.8); }
          25% { transform: translateY(20%) scaleY(1) skewY(-1deg); }
          50% { transform: translateY(10%) scaleY(1.1) skewY(1deg); }
          75% { transform: translateY(5%) scaleY(1) skewY(-1deg); }
        }
        .animate-gradient {
          animation: gradientMove 15s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-gradient { animation: none; }
        }
      `}</style>
    </div>
  )
}
