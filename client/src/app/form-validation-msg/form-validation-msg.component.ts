//common module used to provide form validation alerts on each field

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-validation-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isInvalid) {
      <div class="alert alert-danger">
        @if (isRequiredError) {
          <div>{{ fieldName }} is required</div>
        }
      </div>
    }
  `
})
export class ValidationMessagesComponent {
  @Input() control: any;
  @Input() fieldName = 'Field';
  
  get isInvalid(): boolean {
    return this.control?.invalid && (this.control?.dirty || this.control?.touched);
  }

  get isRequiredError(): boolean {
    return this.control?.errors?.required;
  }
}