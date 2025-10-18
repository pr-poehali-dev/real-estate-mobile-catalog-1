import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  area: number;
  rooms: number;
  floor: number;
  total_floors: number;
  image_url?: string;
  lat: number;
  lng: number;
  district: string;
  description?: string;
}

const API_URL = 'https://functions.poehali.dev/214848f9-00c9-41b2-a027-964de2d33c10';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    address: '',
    area: '',
    rooms: '',
    floor: '',
    total_floors: '',
    image_url: '',
    lat: '40.1776',
    lng: '44.5126',
    district: 'Кентрон',
    description: ''
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('agent_logged_in');
    if (!isLoggedIn) {
      navigate('/agent/login');
      return;
    }
    loadProperties();
  }, [navigate]);

  const loadProperties = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          price: parseInt(formData.price),
          address: formData.address,
          area: parseInt(formData.area),
          rooms: parseInt(formData.rooms),
          floor: parseInt(formData.floor),
          total_floors: parseInt(formData.total_floors),
          image_url: formData.image_url || null,
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
          district: formData.district,
          description: formData.description
        })
      });

      if (response.ok) {
        toast({
          title: 'Успешно!',
          description: 'Объект недвижимости добавлен',
        });
        setIsOpen(false);
        setFormData({
          title: '',
          price: '',
          address: '',
          area: '',
          rooms: '',
          floor: '',
          total_floors: '',
          image_url: '',
          lat: '40.1776',
          lng: '44.5126',
          district: 'Кентрон',
          description: ''
        });
        loadProperties();
      } else {
        throw new Error('Failed to create property');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить объект',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот объект?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Удалено',
          description: 'Объект успешно удалён',
        });
        loadProperties();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить объект',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('agent_logged_in');
    navigate('/agent/login');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ֏';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Icon name="Building2" size={24} className="text-primary" />
            <h1 className="text-xl font-bold">Панель агента</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" size={16} className="mr-2" />
              На сайт
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Мои объекты</h2>
            <p className="text-muted-foreground">Всего: {properties.length}</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Icon name="Plus" size={18} />
                Добавить объект
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Новый объект недвижимости</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="title">Название</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="2-комнатная квартира в центре"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Цена (֏)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="85000000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Площадь (м²)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      required
                      placeholder="62"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rooms">Комнат</Label>
                    <Input
                      id="rooms"
                      type="number"
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      required
                      placeholder="2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">Район</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      required
                      placeholder="Кентрон"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      placeholder="ул. Абовяна, 10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floor">Этаж</Label>
                    <Input
                      id="floor"
                      type="number"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      required
                      placeholder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total_floors">Всего этажей</Label>
                    <Input
                      id="total_floors"
                      type="number"
                      value={formData.total_floors}
                      onChange={(e) => setFormData({ ...formData, total_floors: e.target.value })}
                      required
                      placeholder="12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lat">Широта</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.000001"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                      required
                      placeholder="40.1776"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lng">Долгота</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.000001"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                      required
                      placeholder="44.5126"
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="image_url">URL изображения</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Просторная квартира в отличном состоянии..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Добавление...' : 'Добавить объект'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Отмена
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              {property.image_url && (
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={property.image_url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{property.address}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{property.rooms} к</span>
                  <span>{property.area} м²</span>
                  <span>{property.floor}/{property.total_floors}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xl font-bold">{formatPrice(property.price)}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(property.id)}
                  className="w-full gap-2"
                >
                  <Icon name="Trash2" size={16} />
                  Удалить
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <Icon name="Building2" size={48} className="mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Нет объектов</p>
            <p className="text-sm text-muted-foreground">Добавьте первый объект недвижимости</p>
          </div>
        )}
      </main>
    </div>
  );
}
