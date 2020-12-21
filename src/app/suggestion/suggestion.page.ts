import { Component, OnInit } from '@angular/core';
import {Suggestion} from '../models/Suggestion.model';
import {SuggestionsService} from '../services/suggestions.service';
import {ActivatedRoute, Router} from '@angular/router';


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
              private router: Router) {}

  ngOnInit() {
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
        this.generateSuggestion();
        this.generateTitle();
        this.generateImage();
      });
    });
  }

  // Unused ?
  fetchSuggestions() {
    this.suggService.getSuggestionList().valueChanges().subscribe(res => {
      // console.log(res);
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
    let categorisedSuggestions = [];
    let filteredWithDate = [];
    let randomNumber: number;
    this.formatDate();
    categorisedSuggestions = this.Suggestions.filter( elem => elem.category === this.origin);
    filteredWithDate = categorisedSuggestions.filter( elem => elem.date === this.formatDate());
    // console.log('categorisedSuggestions before filter : ', categorisedSuggestions);
    categorisedSuggestions = filteredWithDate.length > 0 ? filteredWithDate : categorisedSuggestions.filter( elem => elem.date == null);
    randomNumber = Math.trunc(Math.random() * categorisedSuggestions.length);
    this.suggestion = categorisedSuggestions[randomNumber];
    // console.log('categorisedSuggestions after filter : ', categorisedSuggestions);
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

  formatDate(): string {
    let result: string;
    const date = new Date(Date.now());
    result = date.getDate() + '/' + (date.getMonth() + 1);
    return result;
  }

}
