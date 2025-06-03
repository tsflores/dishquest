import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { importProvidersFrom, enableProdMode } from "@angular/core";
import {
	provideHttpClient,
	withInterceptorsFromDi,
} from "@angular/common/http";
import { environment } from "./environments/environment";
import { provideRouter, type Routes } from "@angular/router";
import { HomeComponent } from "./app/home/home.component";
import { PageNotFoundComponent } from "./app/page-not-found/page-not-found.component";
import { RecipedetailComponent } from "./app/recipedetail/recipedetail.component";
import { FormsModule, NgModel } from "@angular/forms";
import { NewrecipeComponent } from "./app/newrecipe/newrecipe.component";
import { FavoriterecipesComponent } from "./app/favoriterecipes/favoriterecipes.component";
import { AboutComponent } from "./app/about/about.component";
import { LoginComponent } from "./app/login/login.component";
import { SignUpComponent } from "./app/sign-up/sign-up.component";

if (environment.production) {
	enableProdMode();
}

// application routes
const routes: Routes = [
	{ path: "", redirectTo: "/dishquest", pathMatch: "full" },
	{ path: "dishquest", component: HomeComponent },
	{ path: "about", component: AboutComponent },
	{ path: "addrecipe", component: NewrecipeComponent },
	{ path: "recipebox", component: FavoriterecipesComponent },
	{ path: "login", component: LoginComponent },
	{path: 'signup', component: SignUpComponent},
	{ path: "recipedetail/:id", component: RecipedetailComponent},
	{ path: "**", component: PageNotFoundComponent }
];

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(BrowserModule, FormsModule, NgModel),
		provideHttpClient(withInterceptorsFromDi()),
		provideRouter(routes),
	],
}).catch((err) => console.error(err));
