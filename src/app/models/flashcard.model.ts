
 /** Flashcard and Flashcard set models */
export interface Flashcard {
  question: string;
  answer: string;
  questionImageUrl?: string;
  answerImageUrl?: string;
}

export interface FlashcardSet {
  id?: string;
  title: string;
  cards: Flashcard[];
  uid: string;
  backgroundImage?: string;
}
