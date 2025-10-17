# Test API Endpoints for Images Collection

## Setup
1. Make sure backend is running on http://localhost:8080
2. Database migration has been run
3. You can use curl, Postman, or any REST client

## Sample Test Flow

### 1. Create a Test Card First (if needed)
```bash
curl -X POST http://localhost:8080/api/cards \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Waifu",
    "description": "A test waifu for collection testing",
    "attack": 100,
    "defense": 80,
    "cost": 5,
    "rarity": "RARE",
    "element": "FIRE",
    "imageUrl": "https://example.com/test-waifu.jpg"
  }'
```

### 2. Create Collections
```bash
# Create first collection
curl -X POST http://localhost:8080/api/cards/1/collections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Collection",
    "description": "Summer themed images of our waifu"
  }'

# Create second collection
curl -X POST http://localhost:8080/api/cards/1/collections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Winter Collection",
    "description": "Winter themed images"
  }'
```

### 3. Get Collections for Card
```bash
curl http://localhost:8080/api/cards/1/collections
```

### 4. Add Images to Collection
```bash
# Add first image
curl -X POST http://localhost:8080/api/collections/1/images \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/summer-beach.jpg",
    "title": "Beach Scene",
    "description": "Relaxing at the beach on a sunny day"
  }'

# Add second image
curl -X POST http://localhost:8080/api/collections/1/images \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/summer-festival.jpg",
    "title": "Summer Festival",
    "description": "Enjoying the summer festival fireworks"
  }'
```

### 5. Get Images for Collection
```bash
curl http://localhost:8080/api/collections/1/images
```

### 6. Add Dialogues to Images
```bash
# Add dialogue to first image
curl -X POST http://localhost:8080/api/images/1/dialogues \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What a beautiful day at the beach!",
    "speaker": "Miku",
    "emotionType": "HAPPY"
  }'

# Add second dialogue
curl -X POST http://localhost:8080/api/images/1/dialogues \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I love the feeling of sand between my toes~",
    "speaker": "Miku",
    "emotionType": "EXCITED"
  }'

# Add third dialogue
curl -X POST http://localhost:8080/api/images/1/dialogues \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Would you like to build a sandcastle with me?",
    "speaker": "Miku",
    "emotionType": "LOVE"
  }'
```

### 7. Get Dialogues for Image
```bash
curl http://localhost:8080/api/images/1/dialogues
```

### 8. Search and Filter Tests
```bash
# Search collections by name
curl "http://localhost:8080/api/collections?name=summer"

# Search images by title
curl "http://localhost:8080/api/collections/1/images/search?title=beach"

# Search dialogues by speaker
curl "http://localhost:8080/api/images/1/dialogues/search?speaker=Miku"

# Search dialogues by emotion
curl "http://localhost:8080/api/images/1/dialogues/search?emotionType=HAPPY"

# Search dialogues by text content
curl "http://localhost:8080/api/images/1/dialogues/search?text=beautiful"
```

### 9. Update Tests
```bash
# Update collection
curl -X PUT http://localhost:8080/api/collections/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Beach Collection",
    "description": "Updated description for summer beach themed images"
  }'

# Update image
curl -X PUT http://localhost:8080/api/images/1 \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "https://example.com/updated-beach.jpg",
    "title": "Updated Beach Scene",
    "description": "Updated description for beach scene"
  }'

# Update dialogue
curl -X PUT http://localhost:8080/api/dialogues/1 \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What an absolutely gorgeous day at the beach!",
    "speaker": "Miku",
    "emotionType": "EXCITED"
  }'
```

### 10. Reorder Tests
```bash
# Reorder images in collection (assuming you have images with IDs 1, 2, 3)
curl -X PATCH http://localhost:8080/api/collections/1/reorder-images \
  -H "Content-Type: application/json" \
  -d '{
    "imageIds": [2, 1, 3]
  }'

# Reorder dialogues in image (assuming you have dialogues with IDs 1, 2, 3)
curl -X PATCH http://localhost:8080/api/images/1/reorder-dialogues \
  -H "Content-Type: application/json" \
  -d '{
    "dialogueIds": [3, 1, 2]
  }'
```

### 11. Additional Utility Tests
```bash
# Get unique speakers for an image
curl http://localhost:8080/api/images/1/speakers

# Get dialogues by order range
curl "http://localhost:8080/api/images/1/dialogues/range?startIndex=0&endIndex=2"

# Get collection details with all nested data
curl http://localhost:8080/api/collections/1

# Get image details with all dialogues
curl http://localhost:8080/api/images/1
```

### 12. Delete Tests (be careful!)
```bash
# Delete dialogue
curl -X DELETE http://localhost:8080/api/dialogues/3

# Delete image (will cascade delete its dialogues)
curl -X DELETE http://localhost:8080/api/images/2

# Delete collection (will cascade delete all images and dialogues)
curl -X DELETE http://localhost:8080/api/collections/2
```

## Expected Response Examples

### Collection Response
```json
{
  "id": 1,
  "cardId": 1,
  "name": "Summer Collection",
  "description": "Summer themed images",
  "images": [
    {
      "id": 1,
      "collectionId": 1,
      "imageUrl": "https://example.com/beach.jpg",
      "title": "Beach Scene",
      "description": "Relaxing at the beach",
      "orderIndex": 0,
      "dialogues": []
    }
  ]
}
```

### Dialogue Response
```json
{
  "id": 1,
  "imageId": 1,
  "text": "What a beautiful day!",
  "speaker": "Miku",
  "orderIndex": 0,
  "emotionType": "HAPPY",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

## Error Testing

### Test Invalid Requests
```bash
# Try to create collection with missing cardId
curl -X POST http://localhost:8080/api/cards/999/collections \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Collection"
  }'

# Try to create image with invalid collection
curl -X POST http://localhost:8080/api/collections/999/images \
  -H "Content-Type: application/json" \
  -d '{
    "imageUrl": "test.jpg",
    "title": "Invalid Image"
  }'

# Try invalid emotion type
curl -X POST http://localhost:8080/api/images/1/dialogues \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Test dialogue",
    "emotionType": "INVALID_EMOTION"
  }'
```

## Performance Testing

### Create Multiple Items
```bash
# Create 10 collections
for i in {1..10}; do
  curl -X POST http://localhost:8080/api/cards/1/collections \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"Collection $i\", \"description\": \"Test collection $i\"}"
done

# Create 20 images for collection 1
for i in {1..20}; do
  curl -X POST http://localhost:8080/api/collections/1/images \
    -H "Content-Type: application/json" \
    -d "{\"imageUrl\": \"https://example.com/image$i.jpg\", \"title\": \"Image $i\"}"
done

# Create 50 dialogues for image 1
for i in {1..50}; do
  curl -X POST http://localhost:8080/api/images/1/dialogues \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"Dialogue line $i\", \"speaker\": \"Speaker$((i % 3 + 1))\", \"emotionType\": \"HAPPY\"}"
done
```

## Notes
- Replace IDs (1, 2, 3) with actual IDs from your responses
- All endpoints support CORS for localhost:3000
- Check backend logs for detailed error messages
- Use the API documentation for complete endpoint reference