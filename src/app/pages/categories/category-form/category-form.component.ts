import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import toastr from "toastr";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMenssages: string[] = null;
  submintingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCateryForm();
    this.loadCategory();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submintingForm = true;

    if (this.currentAction === 'new') {
      this.creatCategory();
    } else {
      this.updateCategory();
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === "new") {
      this.currentAction = "new";
    }
    else {
      this.currentAction = "edit";
    }
  }

  private buildCateryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  private loadCategory() {
    if (this.currentAction === "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))
      ).subscribe(
        category => {
          this.category = category;
          this.categoryForm.patchValue(this.category);
        },
        () => alert("Ocorreu um erro no servidor, tente mais tarde!")
      );
    }
  }

  private setPageTitle() {
    if (this.currentAction === "new") {
      this.pageTitle = "Cadastro de nova categoria";
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = `Editando a categoria: ${categoryName}`;
    }
  }

  private creatCategory() {
    const category: Category = Object.assign(new Category() , this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionForError(error)
      );
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category() , this.categoryForm.value);

    this.categoryService.update(category)
      .subscribe(
        category => this.actionsForSuccess(category),
        error => this.actionForError(error)
      );
  }

  private actionsForSuccess(category: Category) {
    toastr.success("Solicitação processada com sucesso");

    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(["categories", category.id, "edit"])
    );
  }

  private actionForError(error: any) {
    toastr.error("Ocorreu um erro ao processar a sua solicitação");
    this.submintingForm = false;

    if (error.status === 422) {
      this.serverErrorMenssages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMenssages = ["Falha na comunicação com o servidor. Por favor, tente mais tarde."]
    }
  }

}
