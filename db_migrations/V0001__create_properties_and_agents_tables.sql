CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    address VARCHAR(500) NOT NULL,
    area INTEGER NOT NULL,
    rooms INTEGER NOT NULL,
    floor INTEGER NOT NULL,
    total_floors INTEGER NOT NULL,
    image_url TEXT,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    district VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agents (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO agents (email, password_hash, name, phone) VALUES 
('agent@example.com', 'demo_hash_12345', 'Демо Агент', '+374 99 123456');

INSERT INTO properties (title, price, address, area, rooms, floor, total_floors, image_url, lat, lng, district, description) VALUES
('2-комнатная квартира в центре', 85000000, 'ул. Абовяна, 10', 62, 2, 5, 12, 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/3e7d9ace-5622-47fa-8b8c-f66aee07edd4.jpg', 40.1776121, 44.5126233, 'Кентрон', 'Просторная квартира в самом центре Еревана с отличным ремонтом'),
('3-комнатная квартира с видом', 123000000, 'пр. Маршала Баграмяна, 15', 85, 3, 15, 25, 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/43841a1e-583a-4f4d-84b7-ec1c68a32c87.jpg', 40.1872023, 44.5152849, 'Кентрон', 'Современная квартира с панорамным видом на город'),
('1-комнатная студия', 52000000, 'ул. Саряна, 22', 35, 1, 3, 9, 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/77ca65db-c058-47ec-acb5-25adf11d8a84.jpg', 40.1850000, 44.5100000, 'Арабкир', 'Компактная студия в тихом районе'),
('2-комнатная у парка', 78000000, 'ул. Арама, 45', 58, 2, 7, 16, 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/3e7d9ace-5622-47fa-8b8c-f66aee07edd4.jpg', 40.1700000, 44.5050000, 'Давташен', 'Квартира рядом с зелёной зоной'),
('4-комнатная премиум', 185000000, 'пр. Комитаса, 8', 120, 4, 20, 30, 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/43841a1e-583a-4f4d-84b7-ec1c68a32c87.jpg', 40.2000000, 44.5200000, 'Нор Норк', 'Премиум квартира в элитном районе'),
('1-комнатная эконом', 42000000, 'ул. Тиграна Меца, 33', 32, 1, 2, 5, 'https://cdn.poehali.dev/projects/f3b836be-ee04-48cc-8a25-d5c471b3ee81/files/77ca65db-c058-47ec-acb5-25adf11d8a84.jpg', 40.1650000, 44.4950000, 'Шенгавит', 'Доступное жильё для молодой семьи');