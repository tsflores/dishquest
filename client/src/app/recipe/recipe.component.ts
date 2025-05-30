import { Component, type OnInit, Input } from '@angular/core';
import type { Recipe } from "../interfaces";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  standalone: true,
  imports: [RouterLink]
})

export class RecipeComponent implements OnInit {

  //bring in from home.component parent of type Recipe defined in the interface.ts file
  @Input() recipe!: Recipe;

  //use to change the recipe image url consistent with where it is getting served from
  @Input() imagebaseurl = '';

  ngOnInit(): void {
    this.recipe.imageDisplay = this.imagebaseurl + this.recipe.image;
  }

  //getter to calculate the total time to make a recipe
  get totalTime(): number {
    return (Number(this.recipe.preptime) || 0) + (Number(this.recipe.cooktime) || 0);
  }

}
