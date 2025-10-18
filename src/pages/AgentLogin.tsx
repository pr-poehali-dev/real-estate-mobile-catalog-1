import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function AgentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email === 'agent@example.com' && password === 'demo') {
      localStorage.setItem('agent_logged_in', 'true');
      navigate('/agent/dashboard');
    } else {
      alert('Неверный email или пароль. Попробуйте: agent@example.com / demo');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Building2" size={24} className="text-primary" />
            <CardTitle className="text-2xl">Вход для агентов</CardTitle>
          </div>
          <CardDescription>
            Войдите в систему управления объектами недвижимости
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="agent@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Пароль</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full gap-2">
              <Icon name="LogIn" size={18} />
              Войти
            </Button>
            <div className="text-sm text-muted-foreground text-center pt-2">
              Демо: agent@example.com / demo
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
