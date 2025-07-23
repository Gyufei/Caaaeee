import SideNav from './side-nav';

export default function CommonLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col overflow-y-auto overflow-x-hidden">
      <div className="h-[96px] border-b border-border flex items-center justify-center">Header</div>
      <div className="flex-1 flex min-h-[996px]">
        <SideNav />
        {children}
      </div>
      <div className="h-[447px] bg-[#031712]">Footer</div>
    </div>
  );
}
