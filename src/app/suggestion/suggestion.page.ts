import { Component, OnInit } from '@angular/core';
import {Suggestion} from '../models/Suggestion.model';
import {SuggestionsService} from '../services/suggestions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {IonicStorageModule, Storage} from '@ionic/storage';


@Component({
  selector: 'app-suggestion',
  templateUrl: './suggestion.page.html',
  styleUrls: ['../app.component.scss'],
})
export class SuggestionPage implements OnInit {
  Suggestions = [];
  suggestion: Suggestion = new Suggestion();
  id: any;
  imageLoaded = false;
  textLoaded = false;
  origin: string;
  pageTitle: string;

  constructor(private suggService: SuggestionsService,
              private route: ActivatedRoute,
              private router: Router,
              private storage: Storage) {}

  ngOnInit() {
    // Don't forget to comment next line !!!
    // this.storage.clear();
    const paramToCheck = 'origin';
    this.route.queryParams.subscribe(params => {
      this.origin = params[paramToCheck];
      const suggRes = this.suggService.getSuggestionList();
      suggRes.snapshotChanges().subscribe(res => {
        this.Suggestions = [];
        res.forEach(item => {
          const a = item.payload.toJSON();
          a['$key'] = item.key;
          this.Suggestions.push(a as Suggestion);
        });
        this.manageSuggestionStorage().then( () => {
          this.generateTitle();
          this.generateImage();
        });
      });
    });
  }

  // Unused ?
  fetchSuggestions() {
    this.suggService.getSuggestionList().valueChanges().subscribe(res => {
      // console.log(res);
    });
  }

  manageSuggestionStorage(): Promise<any> {
    return new Promise ( resolve => {
      const date = new Date(Date.now());
      const formattedDate = this.formatDate(date);

      this.storage.get(formattedDate).then((storedSuggestions) => {
        console.log('val in storage for today : ', storedSuggestions);
        if (storedSuggestions === null) {
          // set array with new suggestion in storage
          this.getSuggestionFromFirebase();
          this.storage.set(formattedDate, [this.suggestion]).then( res => {
            console.log('result storage.set : ', res);
            resolve();
          });
        } else {
          console.log('check if category exists');
          let foundInStorage = false;
          storedSuggestions.forEach((storedSuggestion) => {
            if (storedSuggestion.category === this.origin) {
              this.suggestion = storedSuggestion;
              foundInStorage = true;
              resolve();
            }
          });
          console.log('found in storage : ', foundInStorage);
          if (!foundInStorage) {
            this.getSuggestionFromFirebase();
            storedSuggestions.push(this.suggestion);
            this.storage.set(formattedDate, storedSuggestions).then( res => {
              console.log('added 1 suggestion to storage : ', res);
              resolve();
            });
          }
        }
      });
    });
  }

  deleteSuggestion(id) {
    console.log(id);
    if (window.confirm('Do you really want to delete?')) {
      this.suggService.deleteSuggestion(id);
    }
  }

  goToMenu() {
    this.router.navigate(['home']);
  }

  getSuggestionFromFirebase() {
    const date = new Date(Date.now());
    let categorisedSuggestions = [];
    let filteredWithDate = [];
    let randomNumber: number;
    categorisedSuggestions = this.Suggestions.filter( elem => elem.category === this.origin);
    filteredWithDate = categorisedSuggestions.filter( elem => elem.date === this.formatDate(date));
    categorisedSuggestions = filteredWithDate.length > 0 ? filteredWithDate : categorisedSuggestions.filter( elem => elem.date == null);
    randomNumber = Math.trunc(Math.random() * categorisedSuggestions.length);
    this.suggestion = categorisedSuggestions[randomNumber];
  }

  generateTitle() {
    switch (this.origin) {
      case 'monsieurH':
        this.pageTitle = 'La suggestion de Monsieur H.';
        break;
      case 'gosses':
        this.pageTitle = 'La suggestion des gosses';
        break;
      default:
        break;
    }
    this.textLoaded = true;
  }

  generateImage() {
    if (!this.suggestion.image || !this.suggestion.image.includes('/images/suggestions')) {
      this.suggestion.image = '/images/suggestions/default-hygge.jpeg';
    }
    this.suggService.getImageUrl(this.suggestion.image).then((imageUrl) => {
      this.suggestion.imageUrl = imageUrl;
      console.log(imageUrl);
      this.imageLoaded = true;
    });
  }

  formatDate(date: Date): string {
    let result: string;
    result = date.getDate() + '/' + (date.getMonth() + 1);
    return result;
  }
}
