import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  area: number;
  rooms: number;
  floor: number;
  totalFloors: number;
  image: string;
  lat: number;
  lng: number;
  district: string;
}

const mockProperties: Property[] = [
  {
    id: 1,
    title: '2-комнатная квартира в центре',
    price: 8500000,
    address: 'ул. Ленина, 45',
    area: 62,
    rooms: 2,
    floor: 5,
    totalFloors: 12,
    image: 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/3e7d9ace-5622-47fa-8b8c-f66aee07edd4.jpg',
    lat: 55.7558,
    lng: 37.6173,
    district: 'Центральный'
  },
  {
    id: 2,
    title: '3-комнатная квартира с видом',
    price: 12300000,
    address: 'пр. Мира, 128',
    area: 85,
    rooms: 3,
    floor: 15,
    totalFloors: 25,
    image: 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/43841a1e-583a-4f4d-84b7-ec1c68a32c87.jpg',
    lat: 55.7600,
    lng: 37.6200,
    district: 'Северный'
  },
  {
    id: 3,
    title: '1-комнатная студия',
    price: 5200000,
    address: 'ул. Садовая, 12',
    area: 35,
    rooms: 1,
    floor: 3,
    totalFloors: 9,
    image: 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/77ca65db-c058-47ec-acb5-25adf11d8a84.jpg',
    lat: 55.7500,
    lng: 37.6100,
    district: 'Западный'
  },
  {
    id: 4,
    title: '2-комнатная у парка',
    price: 7800000,
    address: 'ул. Парковая, 89',
    area: 58,
    rooms: 2,
    floor: 7,
    totalFloors: 16,
    image: 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/3e7d9ace-5622-47fa-8b8c-f66aee07edd4.jpg',
    lat: 55.7520,
    lng: 37.6150,
    district: 'Южный'
  },
  {
    id: 5,
    title: '4-комнатная премиум',
    price: 18500000,
    address: 'пл. Победы, 1',
    area: 120,
    rooms: 4,
    floor: 20,
    totalFloors: 30,
    image: 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/43841a1e-583a-4f4d-84b7-ec1c68a32c87.jpg',
    lat: 55.7580,
    lng: 37.6190,
    district: 'Центральный'
  },
  {
    id: 6,
    title: '1-комнатная эконом',
    price: 4200000,
    address: 'ул. Новая, 55',
    area: 32,
    rooms: 1,
    floor: 2,
    totalFloors: 5,
    image: 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/77ca65db-c058-47ec-acb5-25adf11d8a84.jpg',
    lat: 55.7480,
    lng: 37.6080,
    district: 'Восточный'
  }
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [areaRange, setAreaRange] = useState([0, 150]);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const districts = ['Центральный', 'Северный', 'Западный', 'Восточный', 'Южный'];
  const roomOptions = [1, 2, 3, 4];

  const filteredProperties = mockProperties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesArea = property.area >= areaRange[0] && property.area <= areaRange[1];
    const matchesRooms = selectedRooms.length === 0 || selectedRooms.includes(property.rooms);
    const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(property.district);
    
    return matchesSearch && matchesPrice && matchesArea && matchesRooms && matchesDistrict;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const toggleRoom = (room: number) => {
    setSelectedRooms(prev => 
      prev.includes(room) ? prev.filter(r => r !== room) : [...prev, room]
    );
  };

  const toggleDistrict = (district: string) => {
    setSelectedDistricts(prev =>
      prev.includes(district) ? prev.filter(d => d !== district) : [...prev, district]
    );
  };

  const resetFilters = () => {
    setPriceRange([0, 20000000]);
    setAreaRange([0, 150]);
    setSelectedRooms([]);
    setSelectedDistricts([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold tracking-tight">Недвижимость</h1>
          <div className="flex gap-2">
            <Button
              variant={showMap ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="gap-2"
            >
              <Icon name={showMap ? 'List' : 'Map'} size={16} />
              <span className="hidden sm:inline">{showMap ? 'Список' : 'Карта'}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по адресу или названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                  <Icon name="SlidersHorizontal" size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Фильтры</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Цена: {formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}
                    </label>
                    <Slider
                      min={0}
                      max={20000000}
                      step={100000}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Площадь: {areaRange[0]} — {areaRange[1]} м²
                    </label>
                    <Slider
                      min={0}
                      max={150}
                      step={5}
                      value={areaRange}
                      onValueChange={setAreaRange}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Количество комнат</label>
                    <div className="flex flex-wrap gap-2">
                      {roomOptions.map(room => (
                        <Badge
                          key={room}
                          variant={selectedRooms.includes(room) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => toggleRoom(room)}
                        >
                          {room}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-medium">Район</label>
                    <div className="space-y-2">
                      {districts.map(district => (
                        <div key={district} className="flex items-center space-x-2">
                          <Checkbox
                            id={district}
                            checked={selectedDistricts.includes(district)}
                            onCheckedChange={() => toggleDistrict(district)}
                          />
                          <label
                            htmlFor={district}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {district}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" onClick={resetFilters} className="w-full">
                    Сбросить фильтры
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Найдено: {filteredProperties.length}</span>
            {(selectedRooms.length > 0 || selectedDistricts.length > 0) && (
              <span className="text-primary">• Активные фильтры</span>
            )}
          </div>
        </div>

        {showMap ? (
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="relative h-[600px] bg-muted flex items-center justify-center">
              <div className="text-center space-y-2">
                <Icon name="MapPin" size={48} className="mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">Интерактивная карта</p>
                <p className="text-sm text-muted-foreground">Здесь будет отображаться карта с метками объектов</p>
              </div>
              {filteredProperties.map(property => (
                <div
                  key={property.id}
                  className="absolute bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: `${(property.lng - 37.6) * 1000 + 50}%`,
                    top: `${(55.76 - property.lat) * 1000 + 50}%`
                  }}
                  onClick={() => setSelectedProperty(property)}
                >
                  {property.rooms}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {filteredProperties.map(property => (
              <div
                key={property.id}
                className="group rounded-lg border bg-card overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedProperty(property)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
                      <Icon name="Heart" size={16} />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{property.address}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Home" size={14} />
                      {property.rooms} к
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Maximize" size={14} />
                      {property.area} м²
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Building2" size={14} />
                      {property.floor}/{property.totalFloors}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xl font-bold">{formatPrice(property.price)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredProperties.length === 0 && (
          <div className="text-center py-12 space-y-3">
            <Icon name="SearchX" size={48} className="mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Ничего не найдено</p>
            <Button variant="outline" onClick={resetFilters}>Сбросить фильтры</Button>
          </div>
        )}
      </main>

      {selectedProperty && (
        <Sheet open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
          <SheetContent side="bottom" className="h-[90vh] sm:h-[80vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{selectedProperty.title}</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full aspect-[16/9] object-cover rounded-lg"
              />
              <div className="space-y-3">
                <div>
                  <p className="text-3xl font-bold">{formatPrice(selectedProperty.price)}</p>
                  <p className="text-muted-foreground">{selectedProperty.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 py-4 border-y">
                  <div>
                    <p className="text-sm text-muted-foreground">Комнат</p>
                    <p className="font-semibold">{selectedProperty.rooms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Площадь</p>
                    <p className="font-semibold">{selectedProperty.area} м²</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Этаж</p>
                    <p className="font-semibold">{selectedProperty.floor} из {selectedProperty.totalFloors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Район</p>
                    <p className="font-semibold">{selectedProperty.district}</p>
                  </div>
                </div>
                <div className="space-y-3 pt-2">
                  <h3 className="font-semibold">Описание</h3>
                  <p className="text-muted-foreground">
                    Просторная квартира в отличном состоянии. Развитая инфраструктура, удобная транспортная доступность. 
                    В шаговой доступности школы, детские сады, магазины и парки.
                  </p>
                </div>
                <Button className="w-full gap-2" size="lg">
                  <Icon name="Phone" size={18} />
                  Связаться с продавцом
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
