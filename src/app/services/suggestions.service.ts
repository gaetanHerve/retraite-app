import { Injectable } from '@angular/core';
import {Suggestion} from '../models/Suggestion.model';
import { AngularFireStorage } from '@angular/fire/storage';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {
  suggestionListRef: AngularFireList<any>;
  suggestionRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) { }

  // Create
  createSuggestion(sug: Suggestion) {
    return this.suggestionListRef.push({
      id: sug.id,
      title: sug.title,
      image: sug.image
    });
  }

  // Get Single
  getSuggestion(id: string) {
    this.suggestionRef = this.db.object('/suggestion/' + id);
    return this.suggestionRef;
  }

  // Get List
  getSuggestionList() {
    this.suggestionListRef = this.db.list('/suggestion');
    return this.suggestionListRef;
  }

  // Update
  updateSuggestion(id, sug: Suggestion) {
    return this.suggestionRef.update({
      title: sug.title,
      image: sug.image
    });
  }

  // Delete
  deleteSuggestion(id: string) {
    this.suggestionRef = this.db.object('/suggestion/' + id);
    this.suggestionRef.remove();
  }

  getImageUrl(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.storage.ref(path).getDownloadURL().subscribe(imgUrl => {
        resolve(imgUrl);
      });
    });
  }

}
