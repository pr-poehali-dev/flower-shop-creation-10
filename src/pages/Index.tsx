import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Нежность', price: 3500, image: 'https://cdn.poehali.dev/projects/e8049b84-d597-4a27-8a3b-e157c1d6faa7/files/80122833-9c97-4bdd-afe7-35603e8faa1b.jpg', category: 'Розы' },
  { id: 2, name: 'Свадебный', price: 5500, image: 'https://cdn.poehali.dev/projects/e8049b84-d597-4a27-8a3b-e157c1d6faa7/files/e89e82bd-4e99-4ce1-966a-c57227302f15.jpg', category: 'Романтика' },
  { id: 3, name: 'Весенний', price: 2800, image: 'https://cdn.poehali.dev/projects/e8049b84-d597-4a27-8a3b-e157c1d6faa7/files/d3fde669-c415-4d98-a35f-4ed07a290e05.jpg', category: 'Тюльпаны' },
  { id: 4, name: 'Элегант', price: 4200, image: 'https://cdn.poehali.dev/projects/e8049b84-d597-4a27-8a3b-e157c1d6faa7/files/80122833-9c97-4bdd-afe7-35603e8faa1b.jpg', category: 'Розы' },
  { id: 5, name: 'Праздник', price: 3800, image: 'https://cdn.poehali.dev/projects/e8049b84-d597-4a27-8a3b-e157c1d6faa7/files/d3fde669-c415-4d98-a35f-4ed07a290e05.jpg', category: 'Микс' },
  { id: 6, name: 'Романс', price: 6200, image: 'https://cdn.poehali.dev/projects/e8049b84-d597-4a27-8a3b-e157c1d6faa7/files/e89e82bd-4e99-4ce1-966a-c57227302f15.jpg', category: 'Романтика' },
];

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [priceFilter, setPriceFilter] = useState<'all' | 'under3000' | '3000to5000' | 'over5000'>('all');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = products.filter(product => {
    if (priceFilter === 'all') return true;
    if (priceFilter === 'under3000') return product.price < 3000;
    if (priceFilter === '3000to5000') return product.price >= 3000 && product.price < 5000;
    if (priceFilter === 'over5000') return product.price >= 5000;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-secondary/20">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Флора</h1>
            <div className="hidden md:flex items-center gap-8">
              {['home', 'catalog', 'delivery', 'payment', 'about', 'contacts'].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === section ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {section === 'home' && 'Главная'}
                  {section === 'catalog' && 'Каталог'}
                  {section === 'delivery' && 'Доставка'}
                  {section === 'payment' && 'Оплата'}
                  {section === 'about' && 'О нас'}
                  {section === 'contacts' && 'Контакты'}
                </button>
              ))}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-8 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4">
                          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.price} ₽</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Icon name="Minus" size={12} />
                              </Button>
                              <span className="text-sm w-8 text-center">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Icon name="Plus" size={12} />
                              </Button>
                            </div>
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="X" size={16} />
                          </Button>
                        </div>
                      ))}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Итого:</span>
                          <span>{totalPrice} ₽</span>
                        </div>
                        <Button className="w-full mt-4" size="lg">
                          Оформить заказ
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {activeSection === 'home' && (
        <section className="container mx-auto px-4 py-20 animate-fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              Цветы для особых моментов
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Свежие букеты с доставкой по городу. Создаём настроение каждый день
            </p>
            <Button size="lg" className="text-lg px-8" onClick={() => setActiveSection('catalog')}>
              Смотреть каталог
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product, idx) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                <CardContent className="p-6">
                  <Badge className="mb-2">{product.category}</Badge>
                  <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold">{product.price} ₽</span>
                    <Button onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activeSection === 'catalog' && (
        <section className="container mx-auto px-4 py-12 animate-fade-in">
          <h2 className="text-4xl font-bold mb-8">Каталог букетов</h2>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              variant={priceFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setPriceFilter('all')}
            >
              Все букеты
            </Button>
            <Button
              variant={priceFilter === 'under3000' ? 'default' : 'outline'}
              onClick={() => setPriceFilter('under3000')}
            >
              До 3000 ₽
            </Button>
            <Button
              variant={priceFilter === '3000to5000' ? 'default' : 'outline'}
              onClick={() => setPriceFilter('3000to5000')}
            >
              От 3000 ₽
            </Button>
            <Button
              variant={priceFilter === 'over5000' ? 'default' : 'outline'}
              onClick={() => setPriceFilter('over5000')}
            >
              От 5000 ₽
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all">
                <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
                <CardContent className="p-6">
                  <Badge className="mb-2">{product.category}</Badge>
                  <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold">{product.price} ₽</span>
                    <Button onClick={() => addToCart(product)}>
                      <Icon name="ShoppingCart" size={18} className="mr-2" />
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activeSection === 'delivery' && (
        <section className="container mx-auto px-4 py-12 animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Доставка</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Icon name="Truck" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Доставка по городу</h3>
                      <p className="text-muted-foreground">Бесплатная доставка при заказе от 3000 ₽. Стандартная доставка — 300 ₽</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Icon name="Clock" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Срочная доставка</h3>
                      <p className="text-muted-foreground">Доставим за 2 часа в пределах города — 500 ₽</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Icon name="MapPin" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Самовывоз</h3>
                      <p className="text-muted-foreground">Можете забрать заказ сами из нашего салона по адресу: ул. Цветочная, 15</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'payment' && (
        <section className="container mx-auto px-4 py-12 animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Оплата</h2>
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Icon name="CreditCard" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Картой онлайн</h3>
                      <p className="text-muted-foreground">Принимаем все банковские карты. Безопасная оплата через защищённое соединение</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Icon name="Banknote" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Наличными курьеру</h3>
                      <p className="text-muted-foreground">Оплата при получении заказа</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Icon name="Smartphone" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Переводом на карту</h3>
                      <p className="text-muted-foreground">СБП и банковские переводы</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {activeSection === 'about' && (
        <section className="container mx-auto px-4 py-12 animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">О нас</h2>
            <Card>
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed mb-4">
                  Мы — команда флористов с 10-летним опытом создания букетов для особых моментов. 
                  Каждый букет собирается вручную из свежих цветов, которые мы получаем напрямую от проверенных поставщиков.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Наша миссия — дарить радость и создавать незабываемые впечатления через красоту цветов. 
                  Мы работаем с любовью к своему делу и вниманием к каждой детали.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">10+</div>
                    <div className="text-muted-foreground">лет опыта</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">5000+</div>
                    <div className="text-muted-foreground">счастливых клиентов</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">100%</div>
                    <div className="text-muted-foreground">свежие цветы</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {activeSection === 'contacts' && (
        <section className="container mx-auto px-4 py-12 animate-fade-in">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-8">Контакты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon name="Phone" size={24} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Телефон</h3>
                      <p className="text-muted-foreground">+7 (999) 123-45-67</p>
                      <p className="text-sm text-muted-foreground mt-1">Ежедневно с 9:00 до 21:00</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon name="Mail" size={24} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Email</h3>
                      <p className="text-muted-foreground">info@flora.shop</p>
                      <p className="text-sm text-muted-foreground mt-1">Ответим в течение часа</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon name="MapPin" size={24} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Адрес</h3>
                      <p className="text-muted-foreground">ул. Цветочная, 15</p>
                      <p className="text-sm text-muted-foreground mt-1">м. Парк Культуры</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Icon name="MessageCircle" size={24} className="text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-2">Мессенджеры</h3>
                      <p className="text-muted-foreground">WhatsApp, Telegram</p>
                      <p className="text-sm text-muted-foreground mt-1">Быстрая связь</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-muted/30 mt-20 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground">© 2024 Флора. Все права защищены</p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon">
                <Icon name="Instagram" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Facebook" size={20} />
              </Button>
              <Button variant="ghost" size="icon">
                <Icon name="Twitter" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;