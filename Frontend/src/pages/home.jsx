import { Header } from "@/components/layout/header";
import { Hero } from "@/components/layout/hero";
import { MNGLChatWidget } from "@/components/mngl-chat-widget";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {/* Placeholder for content below hero */}
        <div className="container mx-auto py-12 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-[#0054A6] mb-2">Customer Zone</h3>
                    <p className="text-gray-600 text-sm mb-4">Access your account, pay bills, and view consumption history securely online.</p>
                    <a href="#" className="text-primary font-bold text-sm hover:underline">Login Now &rarr;</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-[#0054A6] mb-2">Safety Guidelines</h3>
                    <p className="text-gray-600 text-sm mb-4">Learn about natural gas safety, emergency procedures, and safe usage practices.</p>
                    <a href="#" className="text-primary font-bold text-sm hover:underline">Read More &rarr;</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-primary hover:-translate-y-1 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-[#0054A6] mb-2">Network Expansion</h3>
                    <p className="text-gray-600 text-sm mb-4">Check our latest coverage areas and upcoming expansion plans in your city.</p>
                    <a href="#" className="text-primary font-bold text-sm hover:underline">View Map &rarr;</a>
                </div>
            </div>
        </div>
      </main>
      
      {/* Footer Mockup */}
      <footer className="bg-[#1a1a1a] text-white py-12 border-t-4 border-primary">
         <div className="container mx-auto px-4 text-center">
             <p className="text-sm text-gray-400">&copy; 2025 Maharashtra Natural Gas Limited. All Rights Reserved.</p>
         </div>
      </footer>

      {/* The Chat Widget Overlay */}
      <MNGLChatWidget />
    </div>
  );
}