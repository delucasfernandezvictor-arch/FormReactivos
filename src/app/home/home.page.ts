import { Component, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonLoading,
  IonToast
} from '@ionic/angular';

// Validador personalizado: SKU de exactamente 12 caracteres alfanuméricos
export function skuValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null; // De esto se encarga Validators.required
  return /^[A-Za-z0-9]{12}$/.test(valor) ? null : { skuInvalido: true };
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonLoading,
    IonToast
  ],
})
export class HomePage {
  public inventarioForm: FormGroup;

  public isSubmitting = signal<boolean>(false);
  public mostrarToast = signal<boolean>(false);

  public categorias = ['Electrónica', 'Herramientas', 'Consumibles'];

  constructor(private fb: FormBuilder) {
    this.inventarioForm = this.fb.group({
      sku: ['', [Validators.required, skuValidator]],
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      stockMinimo: [null, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)]]
    });
  }

  mensajeError(campo: string): string {
    const errores = this.inventarioForm.get(campo)?.errors;
    if (!errores) return '';

    if (errores['required']) return 'Este campo es obligatorio.';
    if (errores['skuInvalido']) return 'El SKU debe tener exactamente 12 caracteres alfanuméricos.';
    if (errores['pattern']) return 'Introduce un número entero.';
    if (errores['min']) return 'El stock mínimo debe ser mayor que 0.';
    return 'Valor no válido.';
  }

  async onSubmit(): Promise<void> {
    if (this.inventarioForm.invalid) {
      this.inventarioForm.markAllAsTouched();
      return;
    }

    // Se guarda el valor ANTES de deshabilitar (un form deshabilitado devuelve value vacío)
    const producto = this.inventarioForm.value;

    this.isSubmitting.set(true);
    this.inventarioForm.disable();

    try {
      console.log('Producto a guardar:', producto);

      // Simulación de guardado local
      await new Promise(resolve => setTimeout(resolve, 2000));

      this.inventarioForm.enable();
      this.inventarioForm.reset();
      this.mostrarToast.set(true);
    } catch (error) {
      console.error('Error al guardar el producto', error);
    } finally {
      this.inventarioForm.enable();
      this.isSubmitting.set(false);
    }
  }
}