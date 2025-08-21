import { Toaster } from 'sonner';

import Footer from './footer/Index';
import Header from './header/Index';
import SideNav from './side-nav';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col overflow-y-auto overflow-x-hidden">
      {/* <div className="h-[96px] border-b border-border flex items-center justify-center">Header</div> */}
      <Header />
      <div className="mt-[96px] flex-1 flex">
        <SideNav />
        {children}
      </div>
      {/* <div className="h-[447px] bg-[#031712]">Footer</div> */}
      <Footer />
      <Toaster />
    </div>
  );
}
