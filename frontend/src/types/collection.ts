export interface DialogueItem {
    id: number;
    imageId: number;
    text: string;
    speaker: string;
    orderIndex: number;
    emotionType: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CollectionImage {
    id: number;
    collectionId: number;
    imageUrl: string;
    title: string;
    description: string;
    orderIndex: number;
    dialogues: DialogueItem[];
}

export interface CardCollectionSummary {
    id: number;
    cardId: number;
    name: string;
    description: string;
    images: CollectionImage[];
}
