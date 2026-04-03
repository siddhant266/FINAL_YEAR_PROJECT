import heroBg from "@assets/generated_images/woman_cooking_in_kitchen.png";
import { Button } from "@/components/ui/button";
import { FileText, Search, CreditCard, Flame, Phone, MapPin, HeadphonesIcon } from "lucide-react";

function ServiceItem({ icon, label }) {
    return (
        <a href="#" className="flex items-center gap-4 p-4 hover:bg-white/10 transition-colors group">
            <div className="bg-primary/90 p-2 rounded-full text-white group-hover:scale-110 transition-transform shadow-md">
                <div className="w-4 h-4 [&>svg]:w-full [&>svg]:h-full">
                    {icon}
                </div>
            </div>
            <span className="text-white text-sm font-medium group-hover:text-primary transition-colors">{label}</span>
        </a>
    )
}

export function Hero() {
  return (
    <div className="relative w-full h-[600px] bg-gray-100 overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Woman cooking" className="w-full h-full object-cover" />
        {/* Gradients to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 h-full relative z-10 flex items-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Content */}
            <div className="md:col-span-8 lg:col-span-8 flex flex-col justify-center text-white space-y-6 animate-in slide-in-from-left-10 duration-700 fade-in">
                <div className="max-w-2xl bg-black/30 backdrop-blur-sm p-8 rounded-lg border-l-4 border-primary shadow-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
                        Over 10.50 lakh households prefer natural gas
                    </h2>
                    <p className="text-2xl md:text-3xl mt-4 font-light text-gray-100 drop-shadow-md">
                        as their cooking fuel....Are you one of them?
                    </p>
                    
                    <Button className="mt-8 bg-primary hover:bg-[#d65f17] text-white rounded-full px-8 py-6 text-lg font-bold shadow-lg transition-transform hover:scale-105">
                        Know More
                    </Button>
                </div>
            </div>

            {/* Right Sidebar - Services */}
            <div className="hidden md:flex md:col-span-4 lg:col-span-3 lg:col-start-10 flex-col justify-center h-full py-10">
                <div className="bg-black/80 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <div className="p-5 border-b border-white/10">
                        <h3 className="text-xl font-bold text-white">Our Services</h3>
                    </div>
                    <div className="divide-y divide-white/10">
                        <ServiceItem icon={<FileText />} label="Apply New Connection" />
                        <ServiceItem icon={<Search />} label="Check CNG/PNG Rates" />
                        <ServiceItem icon={<CreditCard />} label="Pay Your Bill Online" />
                        <ServiceItem icon={<Flame />} label="Gasified Network" />
                        <ServiceItem icon={<Phone />} label="Emergency Helpline" />
                        <ServiceItem icon={<MapPin />} label="Nearest CNG Stations" />
                        <ServiceItem icon={<HeadphonesIcon />} label="Customer Care Contact" />
                    </div>
                </div>
                
                {/* Floating Widget on the left side of screen mockup */}
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 bg-[#00AEEF] text-white p-3 rounded-r-lg shadow-lg cursor-pointer hover:bg-[#009bd6] transition-colors hidden xl:block">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-xl font-bold">₹</span>
                        <span className="text-[10px] font-bold text-center leading-tight">Check<br/>Rates</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Bottom ticker or info bar mockup */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 py-3 px-4 shadow-lg border-t-4 border-primary">
         <div className="container mx-auto flex items-center justify-between overflow-hidden">
             <div className="whitespace-nowrap animate-marquee text-sm font-medium text-gray-700">
                Our Walk-in Centre in Pune Shivaji Nagar and Chinchwad are both operational. Walk-in Centre of Nashik, Office No 1...
             </div>
             <div className="flex gap-1 ml-4">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
             </div>
         </div>
      </div>
    </div>
  );
}