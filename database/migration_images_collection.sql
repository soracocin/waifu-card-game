-- Migration script to update database schema for Images Collection feature
-- Run this script to migrate from old JSON-based dialogues to new normalized structure

-- Step 1: Create the new dialogues table
CREATE TABLE IF NOT EXISTS dialogues (
    id BIGSERIAL PRIMARY KEY,
    image_id BIGINT NOT NULL REFERENCES collection_images(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    speaker VARCHAR(100),
    order_index INTEGER DEFAULT 0,
    emotion_type VARCHAR(20) DEFAULT 'NEUTRAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_dialogues_image_id_order ON dialogues(image_id, order_index);
CREATE INDEX IF NOT EXISTS idx_dialogues_speaker ON dialogues(speaker);
CREATE INDEX IF NOT EXISTS idx_dialogues_emotion_type ON dialogues(emotion_type);

-- Step 3: Update card_collections table to add new fields
ALTER TABLE card_collections 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 4: Update collection_images table to add new fields
ALTER TABLE collection_images 
ADD COLUMN IF NOT EXISTS title VARCHAR(200),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Step 5: Migrate existing JSON dialogues data to normalized structure (if any exist)
-- This is a sample migration - adjust based on your current JSON structure
DO $$
DECLARE
    image_record RECORD;
    dialogue_json JSONB;
    dialogue_item JSONB;
BEGIN
    -- Only run if dialogues column exists (from old structure)
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'collection_images' AND column_name = 'dialogues') THEN
        
        FOR image_record IN SELECT id, dialogues FROM collection_images WHERE dialogues IS NOT NULL LOOP
            dialogue_json := image_record.dialogues;
            
            -- Iterate through JSON array of dialogues
            FOR i IN 0..jsonb_array_length(dialogue_json)-1 LOOP
                dialogue_item := dialogue_json->i;
                
                INSERT INTO dialogues (image_id, text, order_index, speaker, emotion_type)
                VALUES (
                    image_record.id,
                    COALESCE(dialogue_item->>'text', ''),
                    COALESCE((dialogue_item->>'orderIndex')::INTEGER, i),
                    dialogue_item->>'speaker',
                    COALESCE(dialogue_item->>'emotionType', 'NEUTRAL')
                );
            END LOOP;
        END LOOP;
        
        -- After migration, you can optionally drop the old dialogues column
        -- ALTER TABLE collection_images DROP COLUMN dialogues;
    END IF;
END$$;

-- Step 6: Set proper order indexes for existing collections and images
DO $$
DECLARE
    card_record RECORD;
    collection_record RECORD;
    counter INTEGER;
BEGIN
    -- Set order indexes for collections within each card
    FOR card_record IN SELECT DISTINCT card_id FROM card_collections LOOP
        counter := 0;
        FOR collection_record IN 
            SELECT id FROM card_collections 
            WHERE card_id = card_record.card_id 
            ORDER BY created_at ASC LOOP
            
            UPDATE card_collections 
            SET order_index = counter 
            WHERE id = collection_record.id;
            
            counter := counter + 1;
        END LOOP;
    END LOOP;
    
    -- Set order indexes for images within each collection
    FOR collection_record IN SELECT DISTINCT collection_id FROM collection_images LOOP
        counter := 0;
        FOR image_record IN 
            SELECT id FROM collection_images 
            WHERE collection_id = collection_record.collection_id 
            ORDER BY created_at ASC LOOP
            
            UPDATE collection_images 
            SET order_index = counter 
            WHERE id = image_record.id;
            
            counter := counter + 1;
        END LOOP;
    END LOOP;
END$$;

-- Step 7: Add constraints
ALTER TABLE card_collections 
ADD CONSTRAINT IF NOT EXISTS chk_collection_order_index_non_negative 
CHECK (order_index >= 0);

ALTER TABLE collection_images 
ADD CONSTRAINT IF NOT EXISTS chk_image_order_index_non_negative 
CHECK (order_index >= 0);

ALTER TABLE dialogues 
ADD CONSTRAINT IF NOT EXISTS chk_dialogue_order_index_non_negative 
CHECK (order_index >= 0);

ALTER TABLE dialogues 
ADD CONSTRAINT IF NOT EXISTS chk_dialogue_emotion_type 
CHECK (emotion_type IN ('HAPPY', 'SAD', 'ANGRY', 'SURPRISED', 'NEUTRAL', 'EXCITED', 'CONFUSED', 'LOVE', 'EMBARRASSED'));

-- Step 8: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_card_collections_card_id_order ON card_collections(card_id, order_index);
CREATE INDEX IF NOT EXISTS idx_collection_images_collection_id_order ON collection_images(collection_id, order_index);
CREATE INDEX IF NOT EXISTS idx_card_collections_name ON card_collections(name);
CREATE INDEX IF NOT EXISTS idx_collection_images_title ON collection_images(title);

-- Step 9: Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
DROP TRIGGER IF EXISTS update_card_collections_updated_at ON card_collections;
CREATE TRIGGER update_card_collections_updated_at 
    BEFORE UPDATE ON card_collections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collection_images_updated_at ON collection_images;
CREATE TRIGGER update_collection_images_updated_at 
    BEFORE UPDATE ON collection_images 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dialogues_updated_at ON dialogues;
CREATE TRIGGER update_dialogues_updated_at 
    BEFORE UPDATE ON dialogues 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 10: Insert sample data for testing (optional)
INSERT INTO cards (name, description, attack, defense, cost, rarity, element, image_url) 
VALUES ('Sample Waifu', 'A sample waifu card for testing', 100, 80, 5, 'RARE', 'FIRE', 'https://example.com/sample.jpg')
ON CONFLICT DO NOTHING;

-- Final message
DO $$
BEGIN
    RAISE NOTICE 'Images Collection migration completed successfully!';
    RAISE NOTICE 'You can now use the new API endpoints for managing collections, images, and dialogues.';
END$$;