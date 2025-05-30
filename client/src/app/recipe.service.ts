import { Injectable } from '@angular/core';
// biome-ignore lint/style/useImportType: <explanation>
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../environments/environment';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import type { Recipe } from '../app/interfaces';

@Injectable({
  providedIn: 'root'
})

export class RecipeService {

  private apiURL:string = environment.apiurl;
  recipeImageURL: string = environment.recipeImageURL;

  constructor(private http:HttpClient) { }

  //get method that returns the entire list of recipes in the database collection by making use of REST API running on digital ocean
  listRecipes(): Observable<Recipe[]>{
    return this.http.get<Recipe[]>(`${this.apiURL}api/recipes`).pipe(catchError(this.handleError));
  }

  //get method that returns the entire list of recipes in the database collection by making use of REST API running on digital ocean
  getRecipeDetail(id:string): Observable<Recipe>{
    return this.http.get<Recipe>(`${this.apiURL}api/recipes/${id}`).pipe(catchError(this.handleError));
  }

  getRecipeFavorites(): Observable<Recipe>{
    return this.http.get<Recipe>(`${this.apiURL}api/recipes/favorites`).pipe(catchError(this.handleError));
  }

  //create method to insert new recipe record into database
  createRecipe(recipe: FormData): Observable<Recipe>{
    return this.http.post<Recipe>(`${this.apiURL}api/recipes`, recipe).pipe(catchError(this.handleCreateError));
  }

  //put method to update a recipe 
  updateRecipe(id:string, data:any): Observable<Recipe>{
    return this.http.put<Recipe>(`${this.apiURL}api/recipes/${id}`, data).pipe(catchError(this.handleUpdateError));
  }

  //delete method for a single recipe id
  deleteRecipe(id:string){
    return this.http.delete(`${this.apiURL}api/recipes/${id}`).pipe(catchError(this.handleDeleteError));
  }

  //throw error if issue with get method
  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching recipes:', error);
    return throwError(() => 'An error occurred while fetching recipes. Please refresh or try again later.')
  }

  //throw error if issue with post method
  private handleCreateError(error: HttpErrorResponse) {
    console.error('Error creating recipe:', error);
    return throwError(() => 'An error occurred while creating recipe. Please refresh or try again later.')
  }

  //throw error if issue with update method
  private handleUpdateError(error: HttpErrorResponse){
    console.error('Error updating recipe:', error);
    return throwError(() => 'An error occurred while updating the recipe.')
  }

  //throw error if issue with delete method
  private handleDeleteError(error: HttpErrorResponse) {
    console.error('Error deleting recipe:', error);
    return throwError(() => 'An error occurred while deleting the recipe.')
  }
}
