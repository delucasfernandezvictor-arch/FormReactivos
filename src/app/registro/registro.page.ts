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
import { jsPDF } from 'jspdf';

// Validador personalizado: SKU de exactamente 12 caracteres alfanuméricos
export function skuValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null; // De esto se encarga Validators.required
  return /^[A-Za-z0-9]{12}$/.test(valor) ? null : { skuInvalido: true };
}

// Validador personalizado: la fecha de nacimiento no puede ser posterior a hoy
export function fechaNoFuturaValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  return new Date(control.value) > new Date() ? { fechaFutura: true } : null;
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
export class RegistroPage {
  public inventarioForm: FormGroup;

  public isSubmitting = signal<boolean>(false);
  public mostrarToast = signal<boolean>(false);
  public modoOscuro = signal<boolean>(false);
  public ultimoEnvio = signal<any>(null); // Datos del último formulario enviado (para el PDF)

  public categorias = ['Electrónica', 'Herramientas', 'Consumibles'];

  // Fecha de hoy en formato AAAA-MM-DD (hora local) para el atributo max del calendario
  public hoy = new Date().toLocaleDateString('en-CA');

  constructor(private fb: FormBuilder) {
    this.inventarioForm = this.fb.group({
      sku: ['', [Validators.required, skuValidator]],
      nombre: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      stockMinimo: [null, [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)]],
      fechaNacimiento: ['', [Validators.required, fechaNoFuturaValidator]]
    });
  }

  mensajeError(campo: string): string {
    const errores = this.inventarioForm.get(campo)?.errors;
    if (!errores) return '';

    if (errores['required']) return 'Este campo es obligatorio.';
    if (errores['skuInvalido']) return 'El SKU debe tener exactamente 12 caracteres alfanuméricos.';
    if (errores['pattern']) return 'Introduce un número entero.';
    if (errores['min']) return 'El stock mínimo debe ser mayor que 0.';
    if (errores['fechaFutura']) return 'La fecha de nacimiento no puede ser posterior a hoy.';
    return 'Valor no válido.';
  }

  alternarModoOscuro(): void {
    this.modoOscuro.set(!this.modoOscuro());
    document.documentElement.classList.toggle('ion-palette-dark', this.modoOscuro());
  }

  descargarPdf(): void {
    const datos = this.ultimoEnvio();
    if (!datos) return;

    const fecha = datos.fechaNacimiento.split('-').reverse().join('/'); // AAAA-MM-DD -> DD/MM/AAAA

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Datos del producto enviado', 20, 20);
    doc.setFontSize(12);
    doc.text(`Código de barras (SKU): ${datos.sku}`, 20, 40);
    doc.text(`Nombre del producto: ${datos.nombre}`, 20, 50);
    doc.text(`Categoría: ${datos.categoria}`, 20, 60);
    doc.text(`Stock mínimo: ${datos.stockMinimo}`, 20, 70);
    doc.text(`Fecha de nacimiento: ${fecha}`, 20, 80);
    doc.save('producto.pdf');
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

      this.ultimoEnvio.set(producto);
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