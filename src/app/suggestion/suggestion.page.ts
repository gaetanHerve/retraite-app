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
        console.log('this.origin : ', this.origin);

        if (this.origin === 'monsieurH') {
          this.pageTitle = 'La suggestion de Monsieur H.';
          this.suggestion = this.Suggestions[(this.Suggestions.length - 1)];
          this.textLoaded = true;
          console.log('monsieurH suggestion : ', this.suggestion);
        } else {
          this.pageTitle = 'La suggestion des gosses';
          const randomNumber = Math.trunc(Math.random() * 4/*this.Suggestions.length*/);
          this.suggestion = this.Suggestions[randomNumber];
          this.textLoaded = true;
        }

        if (!this.suggestion.image || !this.suggestion.image.includes('/images/suggestions')) {
          this.suggestion.image = '/images/suggestions/default-hygge.jpeg';
        }
        this.suggService.getImageUrl(this.suggestion.image).then((imageUrl) => {
          this.suggestion.imageUrl = imageUrl;
          this.imageLoaded = true;
          console.log('this.suggestion.imageUrl : ', this.suggestion.imageUrl);
        });
      });
    });
  }

  fetchSuggestions() {
    this.suggService.getSuggestionList().valueChanges().subscribe(res => {
      console.log(res);
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

}
