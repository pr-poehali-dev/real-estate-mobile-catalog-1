import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import PropertyMap from '@/components/PropertyMap';

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

const districts = ['Кентрон', 'Арабкир', 'Давташен', 'Нор Норк', 'Шенгавит'];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [priceRange, setPriceRange] = useState([0, 200000000]);
  const [areaRange, setAreaRange] = useState([0, 150]);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const roomOptions = [1, 2, 3, 4];

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesArea = property.area >= areaRange[0] && property.area <= areaRange[1];
    const matchesRooms = selectedRooms.length === 0 || selectedRooms.includes(property.rooms);
    const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(property.district);
    
    return matchesSearch && matchesPrice && matchesArea && matchesRooms && matchesDistrict;
  });



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
    setPriceRange([0, 200000000]);
    setAreaRange([0, 150]);
    setSelectedRooms([]);
    setSelectedDistricts([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ֏';
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
                      max={200000000}
                      step={1000000}
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
            <PropertyMap
              properties={filteredProperties}
              onPropertyClick={setSelectedProperty}
            />
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
                  {property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <Icon name="Building2" size={64} className="text-muted-foreground/30" />
                    </div>
                  )}
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
                      {property.floor}/{property.total_floors}
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
              {selectedProperty.image_url && (
                <img
                  src={selectedProperty.image_url}
                  alt={selectedProperty.title}
                  className="w-full aspect-[16/9] object-cover rounded-lg"
                />
              )}
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
                    <p className="font-semibold">{selectedProperty.floor} из {selectedProperty.total_floors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Район</p>
                    <p className="font-semibold">{selectedProperty.district}</p>
                  </div>
                </div>
                {selectedProperty.description && (
                  <div className="space-y-3 pt-2">
                    <h3 className="font-semibold">Описание</h3>
                    <p className="text-muted-foreground">
                      {selectedProperty.description}
                    </p>
                  </div>
                )}
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