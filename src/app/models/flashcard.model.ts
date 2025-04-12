export interface Flashcard {
    question: string;
    answer: string;
  }
  
  export interface FlashcardSet {
    id?: string;
    title: string;
    cards: Flashcard[];
    uid: string;
    backgroundImage?: string;
  }
  