"use client";
import { Button } from '@/components/ui/button';
import { usePrivy } from '@privy-io/react-auth';

export default function Home() {
  const { ready, login } = usePrivy();

  function handleLogin() {
    if (ready) {
      login();
    } else {
      console.log('privy not ready');
    }
  }

  if (!ready) return <div>加载中...</div>;

  return (
    <div className="p-8">
      <Button
        onClick={() => {
          handleLogin();
          console.log('click');
        }}
      >
        Click
      </Button>
    </div>
  );
}
