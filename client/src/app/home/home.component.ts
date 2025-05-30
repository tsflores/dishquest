import { Component, type OnInit } from '@angular/core';
import { RecipeComponent } from '../recipe/recipe.component';
import { RecipeService } from '../recipe.service';
import { FooterComponent } from '../footer/footer.component';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-home',
  imports: [NavigationComponent, FooterComponent, RecipeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers: [RecipeService],
  standalone: true
})
export class HomeComponent implements OnInit {

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
   recipeList:any;
   recipeImageURL = '';
 
  
   constructor(private recipeService:RecipeService){}

  ngOnInit() {
    this.recipeService.listRecipes().subscribe((recipes) => {
      this.recipeList = recipes;
    });
    this.recipeImageURL = this.recipeService.recipeImageURL;
  }

  //getter to count number of recipes in the collection provided recipeList exists, otherwise 0
  get recipeCount(): number{
    return this.recipeList ? this.recipeList.length : 0;
  }

}
