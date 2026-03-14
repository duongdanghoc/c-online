import RegisterForm from "../register/register-form";
import { GuestBannerSection } from "./GuestBannerSection";
import { GuestGuidlineSection } from "./GuestGuidlineSection";
import { GuestInfoSection } from "./GuestInfoSection";

export default function GuestHomePage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      {/* Hero Section with Banner and Register Form */}
      <div className="bg-muted relative w-full overflow-hidden py-4 md:py-6 lg:py-8">
        {/* Background Pattern Section - Wavy/Diagonal lines as seen in the image */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="20"
                  x2="40"
                  y2="20"
                  stroke="#e6f4a1"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-4 lg:px-8">
          <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left Column: Banner */}
            <div className="lg:col-span-7 xl:col-span-8">
              <GuestBannerSection />
            </div>

            {/* Right Column: Register Form */}
            <div className="flex justify-center lg:col-span-5 lg:justify-end xl:col-span-4">
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>

      {/* Guideline Section */}
      <GuestGuidlineSection />

      {/* Info Section */}
      <GuestInfoSection />
    </div>
  );
}
