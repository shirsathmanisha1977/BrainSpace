export interface UserProfile {
  email: string;
  createdAt: number;
}

export interface Item {
  id: string; // Document ID (usually frontend doesn't need to save this field in Firestore content but we track it)
  type: 'link' | 'image' | 'screenshot';
  url: string; // The URL of the link, or base64 data for image
  title: string;
  aiNotes: string;
  category: string;
  rating: number; // 0-5
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}
