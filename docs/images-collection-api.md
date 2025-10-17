# Images Collection API Documentation

## Overview
The Images Collection feature allows managing multiple image collections for each waifu card. Each collection can contain multiple images, and each image can have multiple dialogues.

## Data Structure
```
Card (1) → CardCollection (n) → CollectionImage (n) → Dialogue (n)
```

## API Endpoints

### Collections Management

#### Get Collections for a Card
```http
GET /api/cards/{cardId}/collections
```
Returns all collections for a specific card, including associated images.

**Response:**
```json
[
  {
    "id": 1,
    "cardId": 1,
    "name": "Summer Collection",
    "description": "Summer themed images",
    "images": [
      {
        "id": 1,
        "collectionId": 1,
        "imageUrl": "https://example.com/image1.jpg",
        "title": "Beach Scene",
        "description": "Relaxing at the beach",
        "orderIndex": 0,
        "dialogues": []
      }
    ]
  }
]
```

#### Create Collection
```http
POST /api/cards/{cardId}/collections
```

**Request Body:**
```json
{
  "name": "Winter Collection",
  "description": "Winter themed images"
}
```

#### Get Collection Details
```http
GET /api/collections/{collectionId}
```
Returns collection details with all images and dialogues.

#### Update Collection
```http
PUT /api/collections/{collectionId}
```

**Request Body:**
```json
{
  "name": "Updated Collection Name",
  "description": "Updated description"
}
```

#### Delete Collection
```http
DELETE /api/collections/{collectionId}
```

#### Search Collections
```http
GET /api/collections?name=summer
```

### Images Management

#### Get Images for a Collection
```http
GET /api/collections/{collectionId}/images
```

#### Create Image
```http
POST /api/collections/{collectionId}/images
```

**Request Body:**
```json
{
  "imageUrl": "https://example.com/new-image.jpg",
  "title": "New Image",
  "description": "Description of the new image"
}
```

#### Get Image Details
```http
GET /api/images/{imageId}
```

#### Update Image
```http
PUT /api/images/{imageId}
```

**Request Body:**
```json
{
  "imageUrl": "https://example.com/updated-image.jpg",
  "title": "Updated Title",
  "description": "Updated description",
  "orderIndex": 1
}
```

#### Delete Image
```http
DELETE /api/images/{imageId}
```

#### Search Images by Title
```http
GET /api/collections/{collectionId}/images/search?title=beach
```

#### Reorder Images
```http
PATCH /api/collections/{collectionId}/reorder-images
```

**Request Body:**
```json
{
  "imageIds": [3, 1, 2]
}
```

### Dialogues Management

#### Get Dialogues for an Image
```http
GET /api/images/{imageId}/dialogues
```

**Response:**
```json
[
  {
    "id": 1,
    "imageId": 1,
    "text": "Hello! It's such a beautiful day at the beach!",
    "speaker": "Miku",
    "orderIndex": 0,
    "emotionType": "HAPPY",
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  }
]
```

#### Create Dialogue
```http
POST /api/images/{imageId}/dialogues
```

**Request Body:**
```json
{
  "text": "This is a new dialogue line",
  "speaker": "Miku",
  "emotionType": "EXCITED"
}
```

#### Update Dialogue
```http
PUT /api/dialogues/{dialogueId}
```

**Request Body:**
```json
{
  "text": "Updated dialogue text",
  "speaker": "Rin",
  "emotionType": "LOVE",
  "orderIndex": 2
}
```

#### Delete Dialogue
```http
DELETE /api/dialogues/{dialogueId}
```

#### Search Dialogues
```http
GET /api/images/{imageId}/dialogues/search?text=beautiful&speaker=Miku&emotionType=HAPPY
```

#### Get Unique Speakers
```http
GET /api/images/{imageId}/speakers
```

**Response:**
```json
["Miku", "Rin", "Len"]
```

#### Reorder Dialogues
```http
PATCH /api/images/{imageId}/reorder-dialogues
```

**Request Body:**
```json
{
  "dialogueIds": [3, 1, 2]
}
```

#### Get Dialogues by Order Range
```http
GET /api/images/{imageId}/dialogues/range?startIndex=0&endIndex=5
```

## Emotion Types
Valid emotion types for dialogues:
- `HAPPY`
- `SAD`
- `ANGRY`
- `SURPRISED`
- `NEUTRAL`
- `EXCITED`
- `CONFUSED`
- `LOVE`
- `EMBARRASSED`

## Error Responses

### 400 Bad Request
```json
{
  "error": "Collection with name 'Summer Collection' already exists for this card"
}
```

### 404 Not Found
```json
{
  "error": "Collection not found with id: 123"
}
```

### 500 Internal Server Error
```json
{
  "error": "An unexpected error occurred"
}
```

## Usage Examples

### 1. Complete Workflow Example

```javascript
// 1. Get card collections
const collections = await fetch('/api/cards/1/collections').then(r => r.json());

// 2. Create a new collection
const newCollection = await fetch('/api/cards/1/collections', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Holiday Collection',
    description: 'Special holiday images'
  })
}).then(r => r.json());

// 3. Add an image to the collection
const newImage = await fetch(`/api/collections/${newCollection.id}/images`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageUrl: 'https://example.com/holiday.jpg',
    title: 'Holiday Scene',
    description: 'Celebrating the holidays'
  })
}).then(r => r.json());

// 4. Add dialogues to the image
const dialogue1 = await fetch(`/api/images/${newImage.id}/dialogues`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Happy holidays everyone!',
    speaker: 'Miku',
    emotionType: 'HAPPY'
  })
}).then(r => r.json());

const dialogue2 = await fetch(`/api/images/${newImage.id}/dialogues`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'I love this time of year!',
    speaker: 'Miku',
    emotionType: 'EXCITED'
  })
}).then(r => r.json());
```

### 2. Reordering Example

```javascript
// Reorder images in a collection
await fetch('/api/collections/1/reorder-images', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageIds: [3, 1, 2] // New order
  })
});

// Reorder dialogues in an image
await fetch('/api/images/1/reorder-dialogues', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dialogueIds: [5, 3, 4, 1, 2] // New order
  })
});
```

### 3. Search and Filter Example

```javascript
// Search collections by name
const summerCollections = await fetch('/api/collections?name=summer')
  .then(r => r.json());

// Search images by title
const beachImages = await fetch('/api/collections/1/images/search?title=beach')
  .then(r => r.json());

// Search dialogues with multiple criteria
const happyMikuDialogues = await fetch('/api/images/1/dialogues/search?speaker=Miku&emotionType=HAPPY')
  .then(r => r.json());
```

## Notes

- All `orderIndex` values are automatically managed by the backend
- When creating new items, they are added to the end of the list
- Deleting items will cascade delete child items (collection → images → dialogues)
- All timestamps are automatically managed by the backend
- CORS is enabled for `http://localhost:3000` by default