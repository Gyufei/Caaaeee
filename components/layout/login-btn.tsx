import { usePrivy } from '@privy-io/react-auth';
import { Button } from '../ui/button';

export default function LoginBtn() {
  const { ready, login } = usePrivy();

  function handleLogin() {
    if (ready) {
      login();
    } else {
      console.log('privy not ready');
    }
  }
  
  if (!ready) return <Button>Login</Button>;
  
  return (
    <Button onClick={handleLogin}>Login</Button>
  )

}