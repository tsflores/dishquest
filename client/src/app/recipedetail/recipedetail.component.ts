import { Component, type OnInit } from "@angular/core";
import { NavigationComponent } from "../navigation/navigation.component";
import { FooterComponent } from "../footer/footer.component";
import { RecipeService } from "../recipe.service";
import { AuthService } from "../auth.service";
import type { Recipe } from "../interfaces";
import { NgIf } from "@angular/common";
// biome-ignore lint/style/useImportType: <explanation>
import { ActivatedRoute, Router } from "@angular/router";
// biome-ignore lint/style/useImportType: <explanation>
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
// biome-ignore lint/style/useImportType: <explanation>
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { FormsModule } from '@angular/forms';

@Component({
	selector: "app-recipedetail",
	imports: [
		NavigationComponent,
		FooterComponent,
		NgIf,
		MatButtonModule,
		MatProgressSpinnerModule,
		FormsModule
	],
	templateUrl: "./recipedetail.component.html",
	styleUrl: "./recipedetail.component.css",
	standalone: true,
	providers: [RecipeService],
})
export class RecipedetailComponent implements OnInit {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	recipe: Recipe | any;
	recipedisplayurl = "";
	recipedisplayPDFurl = "";
	error: string | null = null;
	editing: boolean | null = null;
	isDeleting: boolean | null = null;
	isFavorited: boolean = false; // boolearn to determine if recipe has been favorited
	isUpdatingFavorite: boolean = false;

	constructor(
		private recipeService: RecipeService,
		private route: ActivatedRoute,
		private router: Router,
		private dialog: MatDialog,
		private snackbar: MatSnackBar,
		private authService: AuthService
	) { }

	ngOnInit() {
		this.getRecipe();
	}

	setEditMode(mode: boolean): void {
		this.editing = (!!mode);
	}

	//function utilizes get method within recipe.services to retrieve detail associated with an object matching the id
	getRecipe(): void {
		const param = this.route.snapshot.paramMap.get("id");

		//make sure id exists
		if (!param) {
			this.error = "Recipe ID not found";
			return;
		}

		this.recipeService.getRecipeDetail(param).subscribe({
			next: (recipe: Recipe) => {
				this.recipe = recipe;
				this.recipedisplayurl = this.recipeService.recipeImageURL + recipe.image;
				this.recipedisplayPDFurl = this.recipeService.recipeImageURL + recipe.recipePDF;

				//ensure that the date fields are instantiated as a Date for proper formatting
				if (this.recipe.createdAt) {
					this.recipe.createdAt = new Date(this.recipe.createdAt);
				}
				if (this.recipe.updatedAt) {
					this.recipe.updatedAt = new Date(this.recipe.updatedAt);
				}

				// Check if recipe is favorited by current user
				this.checkFavoriteStatus();
			},
			error: (err) => {
				console.error("Error fetching recipe:", err);
				this.error = "Error loading recipe details. Please try again.";
			},
		});
	}

	// Check if the current recipe is favorited by the logged-in user
	checkFavoriteStatus(): void {
		const currentUser = this.authService.currentUser;
		if (!currentUser || !this.recipe) {
			this.isFavorited = false;
			return;
		}

		this.recipeService.checkFavoriteStatus(currentUser.id, this.recipe._id).subscribe({
			next: (response) => {
				this.isFavorited = response.isFavorited;
			},
			error: (err) => {
				console.error("Error checking favorite status:", err);
				this.isFavorited = false;
			}
		});
	}

	// Toggle favorite status
	toggleFavorite(): void {
		const currentUser = this.authService.currentUser;
		const config: MatSnackBarConfig = {
			duration: 3000,
			horizontalPosition: 'center', 
			verticalPosition: 'top'
		};
		if (!currentUser) {
			this.snackbar.open("Please log in to add recipes to your favorites", "Close", config);
			return;
		}

		if (!this.recipe) {
			return;
		}

		this.isUpdatingFavorite = true;

		if (this.isFavorited) {
			// Remove from favorites
			this.recipeService.removeFromFavorites(currentUser.id, this.recipe._id).subscribe({
				next: () => {
					this.isFavorited = false;
					this.isUpdatingFavorite = false;
					this.snackbar.open("Recipe removed from your Recipe Box", "Close", config);
				},
				error: (err) => {
					this.isUpdatingFavorite = false;
					console.error("Error removing from favorites:", err);
					this.snackbar.open("Error removing from favorites. Please try again.", "Close", config);
				}
			});
		} else {
			// Add to favorites
			this.recipeService.addToFavorites(currentUser.id, this.recipe._id).subscribe({
				next: () => {
					this.isFavorited = true;
					this.isUpdatingFavorite = false;
					this.snackbar.open("Recipe added to your Recipe Box", "Close", config);
				},
				error: (err) => {
					this.isUpdatingFavorite = false;
					console.error("Error adding to favorites:", err);
					this.snackbar.open("Error adding to favorites. Please try again.", "Close", config);
				}
			});
		}
	}

	//refresh the recipe description in the database
	updateRecipe(obj: any): void {

		//update the description or the favorite flag, based on obj value
		if (obj.description) {
			this.recipe.description = obj.description;
		} else {
			this.recipe.favorite = obj;
		}

		this.recipeService.updateRecipe(this.recipe._id, this.recipe).subscribe({
			next: (result) => {
				console.log("Update result ", result);
				location.reload();
			},
			error: (err) => {
				console.error("Error updating the recipe:", err);
				this.error = "Error updating recipe description. Please try again.";
			}
		});
	}

	// delete a single recipe using the recipeService controller and the Angular Material Design component library
	deleteRecipe(): void {
		if (!this.recipe) return;

		//information to be passed to the dialog component
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			width: "350px",
			data: {
				title: "Warning! Confirm Deletion",
				message: `Are you sure you want to delete the ${this.recipe.name} recipe?`,
				cancelText: "Cancel",
				confirmText: "Delete"
			},
		});

		//delete or exit following user confirmation
		dialogRef.afterClosed().subscribe((result) => {
			if (result && this.recipe) {
				this.isDeleting = true;

				this.recipeService.deleteRecipe(this.recipe._id).subscribe({
					next: () => {
						this.isDeleting = false;
						this.snackbar.open(
							`Recipe ${this.recipe.name} has been deleted`,
							"Close",
							{
								duration: 5000,
							},
						);
						this.router.navigate(["/"]);
					},
					error: (error) => {
						this.isDeleting = false;
						console.error("Error deleting recipe:", error);
						this.error = "Failed to delete recipe. Please try again.";
					},
				});
			}
		});
	}
}
