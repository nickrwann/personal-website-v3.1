import { MapPin, Mail } from "lucide-react";
import profileImage from "@assets/profile.jpeg";

export function HeroSection() {
  return (
    <div className="flex flex-col items-center text-center mb-12">
      <img
        src={profileImage}
        alt="Nick Wanner"
        className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-1 ring-border mb-6"
        data-testid="img-profile"
      />
      
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" data-testid="text-name">
        Nick Wanner
      </h1>
      
      {/* Large screens: one line */}
      <p className="hidden md:block text-lg md:text-xl text-muted-foreground mb-6 px-4 whitespace-nowrap" data-testid="text-subtitle">
        Software Engineer & Creative Problem Solver
      </p>
      
      {/* Small screens: three lines */}
      <div className="md:hidden text-lg text-muted-foreground mb-6 px-4 space-y-1" data-testid="text-subtitle-mobile">
        <p className="text-center">Software Engineer</p>
        <p className="text-center">&</p>
        <p className="text-center">Creative Problem Solver</p>
      </div>
      
      <div className="flex flex-row flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 whitespace-nowrap" data-testid="text-location">
          <MapPin className="w-4 h-4" />
          <span>Austin, TX</span>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap" data-testid="text-email">
          <Mail className="w-4 h-4" />
          <a href="mailto:nickrwann@gmail.com" className="hover:text-foreground transition-colors">
            nickrwann@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
