//component to render saved recipes - use RecipeComponent with a filtered get request

import { Component, type OnInit } from '@angular/core';
import { RecipeComponent } from '../recipe/recipe.component';
import { RecipeService } from '../recipe.service';
import { AuthService } from '../auth.service';
import { FooterComponent } from '../footer/footer.component';
import { NavigationComponent } from '../navigation/navigation.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favoriterecipes',
  imports: [FooterComponent, NavigationComponent, RecipeComponent],
  templateUrl: './favoriterecipes.component.html',
  styleUrl: './favoriterecipes.component.css',
  standalone: true,
  providers: [RecipeService]
})
export class FavoriterecipesComponent implements OnInit {

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  recipeList: any;
  recipeImageURL = '';
  error: string | null = null;
  loading: boolean = true;


  constructor(private recipeService: RecipeService, 
              private authService: AuthService, 
              private router: Router) { }

  ngOnInit() {
    this.loadUserFavorites();
    this.recipeImageURL = this.recipeService.recipeImageURL;
    
  }

  private loadUserFavorites(): void {
    const currentUser = this.authService.currentUser;
    
    if (!currentUser) {
      // User is not logged in, redirect to login
      this.error = 'Please log in to view your favorite recipes';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.recipeService.getUserFavorites(currentUser.id).subscribe({
      next: (recipes) => {
        this.recipeList = recipes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user favorites:', err);
        this.error = 'Failed to load your favorite recipes. Please try again.';
        this.loading = false;
      }
    });
  }

  //getter to count number of recipes in the collection provided recipeList exists, otherwise 0
  get recipeCount(): number {
    return this.recipeList ? this.recipeList.length : 0;
  }

}
