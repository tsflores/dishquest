// biome-ignore lint/style/useImportType: <explanation>
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NavigationComponent } from "../navigation/navigation.component";
import { FooterComponent } from "../footer/footer.component";
// biome-ignore lint/style/useImportType: <explanation>
import { RecipeService } from "../recipe.service";
import type { Recipe } from "../interfaces";
import { ValidationMessagesComponent } from "../form-validation-msg/form-validation-msg.component";
import { CommonModule } from "@angular/common";
// biome-ignore lint/style/useImportType: <explanation>
import { Router } from "@angular/router";

@Component({
	selector: "app-newrecipe",
	imports: [
		FormsModule,
		NavigationComponent,
		FooterComponent,
		ValidationMessagesComponent,
		CommonModule,
	],
	templateUrl: "./newrecipe.component.html",
	styleUrl: "./newrecipe.component.css",
	standalone: true,
})
export class NewrecipeComponent implements OnInit {
	constructor(
		private recipeService: RecipeService,
		private router: Router,
	) { }

	error: string | null = null;

	recipe: Recipe = {
		_id: "",
		name: "",
		chef: "",
		description: "",
		meal: "breakfast", //keeps this as the default
		preptime: "",
		cooktime: "",
		image: "",
		recipePDF: "",
		favorites: null,
		imageDisplay: "",
		createdAt: null,
	};

	imagetoUpload: any = null;
	pdftoUpload: any = null;
	fileInputField: any = null;
	allowedImageTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
	allowedPdfTypes = ['application/pdf'];

	//for purposes of managing the file uploads
	handleFileInput(target: any, type: 'image' | 'pdf'): void {

		//make sure file type is correct
		const file = target.files.item(0);
		if (type === 'image') {
			if (!this.allowedImageTypes.includes(file.type)) {
				alert('Please select a valid image file (png, jpg, jpeg, gif, webp).');
				target.value = '';
				return;
			}
			this.imagetoUpload = file;
		} else if(type === 'pdf'){
			if (!this.allowedPdfTypes.includes(file.type)) {
				alert('Please select a valid recipe file (pdf only).');
				target.value = '';
				return;
			}
			this.pdftoUpload = file;
		}

		this.fileInputField = target;
	}

	ngOnInit(): void { }

	//use post method to insert new record into the collection
	save(newRecipeForm: any): void {
		const formData = new FormData();
		formData.append("name", this.recipe.name);
		formData.append("chef", this.recipe.chef);
		formData.append("description", this.recipe.description);
		formData.append("meal", this.recipe.meal);
		formData.append("preptime", this.recipe.preptime);
		formData.append("cooktime", this.recipe.cooktime);
		formData.append("image", this.imagetoUpload, this.imagetoUpload.name);
		formData.append("recipePDF", this.pdftoUpload, this.pdftoUpload.name);
		this.recipeService.createRecipe(formData).subscribe({
			next: (recipe) => {
				console.log(recipe);
				newRecipeForm.reset();
				this.fileInputField.value = "";
				this.router.navigate(["/"]);
			},
			error: (err) => {
				console.error("Error creating recipe:", err);
				this.error = "Error creating recipe. Please try again.";
			},
		});
	}
}
