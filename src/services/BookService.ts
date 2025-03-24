import httpClient from "@/services/httpClient";
//todo: add missing imports for interfaces, types
import type { IBook } from "@/types/interfaces/IBook";

export class BookService {
    async getAll() {
        let attempts = 0;
        const maxAttempts = 10;
        while (attempts < maxAttempts) {
            try {
                const response = await httpClient.get('/Book');

                return response.data;
            } catch (error: any) {
                if (error.response?.status !== 408 || attempts >= maxAttempts - 1) {
                    console.error('Failed to fetch books (timeout):', error);
                    throw error;
                }
                attempts++;
                console.warn(`Retrying fetch books, attempt: ${attempts + 1}`);
            }
        }
        return []; // Return an empty array if all attempts fail
    }
    async getBookById(bookId: string) {
        try {
            const response = await httpClient.get(`/Book/${bookId}`);
            if (!response.data) {
                throw new Error('Book not found');
            }
            return this.mapToIBook(response.data);
        } catch (error) {
            console.error('Error fetching book:', error);
            throw error;
        }
    }

    mapToIBook(book: any): IBook {
      return {
        id: book._id,
        apiId: book.apiId,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        publishedDate: book.publishedDate,
        coverImage: book.coverImage,
        genres: book.genres,
        ratings: book.ratings,
        averageRating: book.averageRating
      } as IBook;
}
}
