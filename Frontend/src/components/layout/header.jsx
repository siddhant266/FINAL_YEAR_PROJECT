import {
  Search,
  Phone,
  Mail,
  GraduationCap,
  BarChart,
  Facebook,
  Twitter,
  Linkedin,
  ChevronDown,
  User,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import logo from "@assets/generated_images/mngl_corporate_logo.png";
import mascot from "@assets/generated_images/gas_utility_worker_mascot.png";

export function Header() {
  return (
    <div className="w-full flex flex-col font-sans sticky top-0 z-50">
      {/* Top Bar - Orange */}
      <div className="bg-primary text-white py-1 px-4 text-xs font-medium tracking-wide relative z-50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 overflow-x-auto w-full md:w-auto">
            <div className="flex items-center gap-1 bg-white text-gray-800 rounded px-2 py-0.5">
              <span className="text-[10px] font-bold">PUNE</span>
              <ChevronDown className="h-3 w-3" />
            </div>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Phone className="h-3 w-3 fill-current" />
              <span>1800 266 2696</span>
            </div>
            <div className="hidden md:flex items-center gap-1 border-l border-white/30 pl-4">
              <Mail className="h-3 w-3" />
              <span>customercare@mngl.in</span>
            </div>
            <div className="hidden lg:flex items-center gap-1 border-l border-white/30 pl-4 whitespace-nowrap">
              <Phone className="h-3 w-3 fill-current" />
              <span>9011 676767 - Emergency Helpline</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 hover:text-white/80 cursor-pointer">
              <GraduationCap className="h-4 w-4" />
              <span>Edu Portal</span>
            </div>
            <div className="flex items-center gap-1 hover:text-white/80 cursor-pointer">
              <BarChart className="h-4 w-4" />
              <span>Physical Progress</span>
            </div>
            <div className="flex items-center gap-2 border-l border-white/30 pl-4">
              <Facebook className="h-3 w-3 fill-current" />
              <Twitter className="h-3 w-3 fill-current" />
              <Linkedin className="h-3 w-3 fill-current" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - White */}
      <div className="bg-white  shadow-sm relative z-40">
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="MNGL Logo"
              className="h-16 md:h-20 object-contain"
            />
            <div className="hidden lg:block border-l border-gray-200 pl-4">
              <h1 className="text-[#0054A6] text-xl font-bold leading-none">
                Maharashtra Natural Gas Ltd.
              </h1>
              <p className="text-gray-500 text-[10px] font-semibold tracking-wide">
                (A JOINT VENTURE OF GAIL (India) Ltd & BPCL)
              </p>
            </div>
          </div>

          {/* Nav & Actions */}
          <div className="flex items-center gap-6">
            <nav className="hidden xl:flex items-center gap-6 text-sm font-semibold text-gray-700">
              <Link
                href="/"
                className="text-primary hover:text-primary transition-colors"
              >
                Home
              </Link>

              <Link
                href="/complaints/classification"
                className="hover:text-primary transition-colors"
              >
                Complaint Classification
              </Link>

              <a href="#" className="hover:text-primary transition-colors">
                Corporate
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                CSR
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                Investors
              </a>
            </nav>

            <div className="flex items-center gap-4">
              <Button className="bg-[#0054A6] hover:bg-[#004286] text-white rounded font-bold shadow-md gap-2">
                <LogIn className="h-4 w-4" />
                LOGIN
              </Button>
              <img src={mascot} alt="Mascot" className="h-16 hidden md:block" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Dropdowns */}
      <div className="bg-white border-t border-gray-100 shadow-md relative z-30 hidden md:block h-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            {[
              "Business",
              "Customer Zone",
              "Partner Zone",
              "Health, Safety & Environment",
              "Contact Us",
              "Initiative",
            ].map((item) => (
              <div
                key={item}
                className="group relative px-6 py-4 cursor-pointer hover:bg-gray-50 border-r border-gray-100 last:border-r-0 transition-colors"
              >
                <span className="text-sm font-bold text-gray-700 group-hover:text-primary flex items-center gap-1">
                  {item}
                  <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-primary transition-transform group-hover:rotate-180" />
                </span>

                {/* Dropdown Mockup */}
                <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-b-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 z-50 border-t-2 border-primary">
                  <div className="py-2">
                    <div className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-600 hover:text-primary">
                      Sub Menu Item 1
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-600 hover:text-primary">
                      Sub Menu Item 2
                    </div>
                    <div className="px-4 py-2 hover:bg-gray-50 text-sm text-gray-600 hover:text-primary">
                      Sub Menu Item 3
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
