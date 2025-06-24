-- Database initialization script for Waifu Card Game

-- Drop tables if they exist (for clean restart)
DROP TABLE IF EXISTS battles CASCADE;
DROP TABLE IF EXISTS deck_cards CASCADE;
DROP TABLE IF EXISTS decks CASCADE;
DROP TABLE IF EXISTS user_cards CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    coins INTEGER DEFAULT 1000,
    gems INTEGER DEFAULT 100,
    experience_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cards master table
CREATE TABLE cards (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    attack INTEGER NOT NULL,
    defense INTEGER NOT NULL,
    cost INTEGER NOT NULL,
    rarity VARCHAR(20) NOT NULL CHECK (rarity IN ('COMMON', 'RARE', 'EPIC', 'LEGENDARY')),
    element VARCHAR(20) NOT NULL CHECK (element IN ('FIRE', 'WATER', 'EARTH', 'AIR', 'LIGHT', 'DARK')),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User's card collection
CREATE TABLE user_cards (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id BIGINT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    experience INTEGER DEFAULT 0,
    obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, card_id)
);

-- User's decks
CREATE TABLE decks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cards in each deck
CREATE TABLE deck_cards (
    id BIGSERIAL PRIMARY KEY,
    deck_id BIGINT NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
    card_id BIGINT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    UNIQUE(deck_id, card_id),
    UNIQUE(deck_id, position)
);

-- Battle history
CREATE TABLE battles (
    id BIGSERIAL PRIMARY KEY,
    player1_id BIGINT NOT NULL REFERENCES users(id),
    player2_id BIGINT NOT NULL REFERENCES users(id),
    winner_id BIGINT REFERENCES users(id),
    player1_deck_id BIGINT NOT NULL REFERENCES decks(id),
    player2_deck_id BIGINT NOT NULL REFERENCES decks(id),
    status VARCHAR(20) NOT NULL CHECK (status IN ('WAITING', 'IN_PROGRESS', 'FINISHED', 'CANCELLED')),
    battle_data JSONB,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP
);

-- Insert sample waifu cards
INSERT INTO cards (name, description, attack, defense, cost, rarity, element, image_url) VALUES
-- Common Cards
('Sakura Warrior', 'A brave warrior with cherry blossom powers', 3, 2, 2, 'COMMON', 'EARTH', '/images/cards/sakura_warrior.jpg'),
('Lightning Mage', 'Swift spellcaster with electric abilities', 4, 1, 3, 'COMMON', 'AIR', '/images/cards/lightning_mage.jpg'),
('Fire Princess', 'Royal flame wielder with burning passion', 3, 3, 3, 'COMMON', 'FIRE', '/images/cards/fire_princess.jpg'),
('Water Guardian', 'Protective spirit of the ocean depths', 2, 4, 3, 'COMMON', 'WATER', '/images/cards/water_guardian.jpg'),

-- Rare Cards
('Shadow Assassin', 'Silent hunter from the realm of darkness', 5, 2, 4, 'RARE', 'DARK', '/images/cards/shadow_assassin.jpg'),
('Holy Priestess', 'Divine healer blessed by celestial light', 2, 6, 4, 'RARE', 'LIGHT', '/images/cards/holy_priestess.jpg'),
('Storm Witch', 'Tempest controller with weather magic', 6, 3, 5, 'RARE', 'AIR', '/images/cards/storm_witch.jpg'),
('Crystal Archer', 'Precise marksman with gemstone arrows', 5, 4, 5, 'RARE', 'EARTH', '/images/cards/crystal_archer.jpg'),

-- Epic Cards
('Phoenix Queen', 'Reborn ruler of eternal flames', 7, 5, 6, 'EPIC', 'FIRE', '/images/cards/phoenix_queen.jpg'),
('Frost Empress', 'Ice sovereign with freezing domain', 6, 6, 6, 'EPIC', 'WATER', '/images/cards/frost_empress.jpg'),
('Void Sorceress', 'Master of space and nothingness', 8, 4, 7, 'EPIC', 'DARK', '/images/cards/void_sorceress.jpg'),

-- Legendary Cards
('Divine Dragon Maiden', 'Ultimate fusion of dragon and maiden power', 10, 8, 9, 'LEGENDARY', 'LIGHT', '/images/cards/divine_dragon_maiden.jpg'),
('Eternal Goddess', 'Omnipotent deity of all elements', 12, 10, 10, 'LEGENDARY', 'LIGHT', '/images/cards/eternal_goddess.jpg');

-- Create a demo user
INSERT INTO users (username, email, password_hash, coins, gems) VALUES
('player1', 'player1@example.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE8mKyTFTdg0q2o.S', 5000, 500);

-- Give the demo user some starter cards
INSERT INTO user_cards (user_id, card_id, level) 
SELECT 1, id, 1 FROM cards WHERE rarity IN ('COMMON', 'RARE') LIMIT 10;

-- Create a starter deck for the demo user
INSERT INTO decks (user_id, name, is_active) VALUES (1, 'Starter Deck', TRUE);

-- Add cards to the starter deck
INSERT INTO deck_cards (deck_id, card_id, position)
SELECT 1, card_id, ROW_NUMBER() OVER (ORDER BY card_id)
FROM user_cards WHERE user_id = 1 LIMIT 5;

-- Create indexes for better performance
CREATE INDEX idx_user_cards_user_id ON user_cards(user_id);
CREATE INDEX idx_deck_cards_deck_id ON deck_cards(deck_id);
CREATE INDEX idx_battles_player1_id ON battles(player1_id);
CREATE INDEX idx_battles_player2_id ON battles(player2_id);
CREATE INDEX idx_battles_status ON battles(status);

-- Add some trigger functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_decks_updated_at BEFORE UPDATE ON decks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();