import { Component, Directive, signal } from '@angular/core';
import {
  FormsModule,
  NgForm,
  NgModel,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
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

// En template-driven, los validadores personalizados son DIRECTIVAS (en reactivo eran funciones)
@Directive({
  selector: '[appMayorQueCero]',
  providers: [{ provide: NG_VALIDATORS, useExisting: MayorQueCeroDirective, multi: true }]
})
export class MayorQueCeroDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value === null || control.value === '') return null; // De esto se encarga required
    return Number(control.value) > 0 ? null : { mayorQueCero: true };
  }
}

@Directive({
  selector: '[appFechaNoFutura]',
  providers: [{ provide: NG_VALIDATORS, useExisting: FechaNoFuturaDirective, multi: true }]
})
export class FechaNoFuturaDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    return new Date(control.value) > new Date() ? { fechaFutura: true } : null;
  }
}

// Cifra un texto con SHA-256 y lo devuelve en hexadecimal
async function cifrarSHA256(texto: string): Promise<string> {
  const datos = new TextEncoder().encode(texto);
  const hash = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

@Component({
  selector: 'app-driven',
  templateUrl: 'driven.page.html',
  styleUrls: ['driven.page.scss'],
  imports: [
    FormsModule,
    RouterLink,
    MayorQueCeroDirective,
    FechaNoFuturaDirective,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
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
export class DrivenPage {
  // En template-driven, el modelo vive en el componente y la plantilla lo enlaza con [(ngModel)]
  public modelo: any = this.modeloVacio();

  public isSubmitting = signal<boolean>(false);
  public mostrarToast = signal<boolean>(false);

  public categorias = ['Electrónica', 'Herramientas', 'Consumibles'];
  public hoy = new Date().toLocaleDateString('en-CA');

  private modeloVacio() {
    return { sku: '', nombre: '', categoria: '', stockMinimo: null, fechaNacimiento: '', password: '' };
  }

  // Recibe la referencia #campo="ngModel" de la plantilla
  mensajeError(control: NgModel, mensajePattern = 'Valor no válido.'): string {
    const errores = control.errors;
    if (!errores) return '';

    if (errores['required']) return 'Este campo es obligatorio.';
    if (errores['pattern']) return mensajePattern;
    if (errores['mayorQueCero']) return 'El stock mínimo debe ser mayor que 0.';
    if (errores['fechaFutura']) return 'La fecha de nacimiento no puede ser posterior a hoy.';
    return 'Valor no válido.';
  }

  async onSubmit(formulario: NgForm): Promise<void> {
    if (formulario.invalid) {
      formulario.form.markAllAsTouched();
      return;
    }

    // Se copia el modelo ANTES de deshabilitar el formulario
    const datos = { ...this.modelo };

    this.isSubmitting.set(true);
    formulario.form.disable();

    try {
      // La contraseña en texto plano nunca llega a la consola
      const producto = { ...datos, password: await cifrarSHA256(datos.password) };
      console.log('Datos a guardar (template-driven, contraseña cifrada):', producto);

      // Simulación de guardado local
      await new Promise(resolve => setTimeout(resolve, 2000));

      formulario.form.enable();
      formulario.resetForm();
      this.modelo = this.modeloVacio();
      this.mostrarToast.set(true);
    } catch (error) {
      console.error('Error al guardar el producto', error);
    } finally {
      formulario.form.enable();
      this.isSubmitting.set(false);
    }
  }
}