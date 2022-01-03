import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{ errorMessage }}
    </p>
  `,
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent {
  @Input('form-control') formControl: FormControl;

  public get errorMessage(): string | null {
    return this.mustShowError() ? this.getErrorMessage() : null;
  }

  private mustShowError(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if (this.formControl.errors.required)
      return "Dado obrigatório";

    else if (this.formControl.errors.email)
      return "Formato de e-mail inválido";
    
    else if (this.formControl.errors.minlength)
      return `Deve ter no mínimo ${this.formControl.errors.minlength.requiredLength} caracteries`;

    else if (this.formControl.errors.maxlength)
      return `Deve ter no máximo ${this.formControl.errors.maxlength.requiredLength} caracteries`;
  }

}
