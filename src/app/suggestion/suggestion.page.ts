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
    // Don't forget to remove next line !!!
    this.storage.clear();
    const paramToCheck = 'origin';
    this.route.queryParams.subscribe(params => {
      this.origin = params[paramToCheck];
      this.fetchSuggestions();
      const suggRes = this.suggService.getSuggestionList();
      suggRes.snapshotChanges().subscribe(res => {
        this.Suggestions = [];
        res.forEach(item => {
          const a = item.payload.toJSON();
          a['$key'] = item.key;
          this.Suggestions.push(a as Suggestion);
        });
        this.manageSuggetionUnicity().then( (result) => {
          console.log('promise result : ', result);
          if (!result) {
            this.generateSuggestion();
          }
        });
        this.generateTitle();
        this.generateImage();
        this.getAllFavorites();

      });
    });
  }



  // Unused ?
  fetchSuggestions() {
    this.suggService.getSuggestionList().valueChanges().subscribe(res => {
      // console.log(res);
    });
  }

  manageSuggetionUnicity(): Promise<boolean> {
    let suggestionMade = false;
    let dateUsed = false;
    let originUsed = false;
    return new Promise( (resolve, reject) => {
      const date = new Date(Date.now());
      this.storage.get('date').then((val) => {
        console.log('date in storage : ', val);
        if (val === this.formatDate(date)) {
          dateUsed = true;
          this.storage.get(this.origin).then( (suggestion) => {
            console.log('suggestion in storage : ', suggestion);
            this.suggestion = suggestion;
            originUsed = true;
          });
        }
        if (dateUsed && originUsed){
          suggestionMade = true;
        }
        console.log('suggestionMade ? ', suggestionMade);
        resolve(suggestionMade);
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

  generateSuggestion() {
    const date = new Date(Date.now());
    let categorisedSuggestions = [];
    let filteredWithDate = [];
    let randomNumber: number;
    categorisedSuggestions = this.Suggestions.filter( elem => elem.category === this.origin);
    filteredWithDate = categorisedSuggestions.filter( elem => elem.date === this.formatDate(date));
    categorisedSuggestions = filteredWithDate.length > 0 ? filteredWithDate : categorisedSuggestions.filter( elem => elem.date == null);
    randomNumber = Math.trunc(Math.random() * categorisedSuggestions.length);
    this.suggestion = categorisedSuggestions[randomNumber];
    this.updateStorage(date);
  }

  updateStorage(date: Date) {
    let existingSuggestion: object;
    let suggestionToAdd;
    const formattedDate = this.formatDate(date);
    /*this.storage.get(formattedDate).then( (suggestion) => {
      console.log('suggestion in storage : ', suggestion);
      if (suggestion !== null) {
        existingSuggestion = suggestion;
      }

    }); */
    // this.storage.set(formattedDate, {origin: this.origin, suggestion: this.suggestion});
    this.storage.set(formattedDate, ['elem1', 'elem2']).then( res => {
      console.log('result storage.set : ', res);
    });
    // this.storage.set(this.origin, this.suggestion);
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

  getAllFavorites(){
    const items = [];
    return new Promise(resolve => {
      this.storage.forEach( (v, k) => {
        console.log('value : ', v);
        console.log('key: ', k);
        items.push(v);
      }).then( () => {
        resolve(items);
      });
    });
  }

}
