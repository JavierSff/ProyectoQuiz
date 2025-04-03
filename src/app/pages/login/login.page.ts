import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/authentication.service'; // Importa el servicio de autenticación
import { Router } from '@angular/router'; // Importa Router para la navegación
import { ToastController } from '@ionic/angular'; // Importa ToastController para mostrar el mensaje emergente

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,  // Inyecta el servicio de autenticación
    private router: Router,  // Inyecta Router para la navegación
    private toastController: ToastController  // Inyecta ToastController
  ) {
    // Inicializa el formulario con validación
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],  // Email validation
      password: ['', [Validators.required, Validators.minLength(8)]], // Password validation
    });
  }

  ngOnInit() {}

  // Enviar el formulario
  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
  
      // Usar el servicio de autenticación para iniciar sesión con las credenciales proporcionadas
      this.authService.loginUser(email, password)
        .then(user => {
          console.log('Usuario autenticado correctamente:', user);  // Debugging line
          // Redirige al usuario a la página de inicio después de un inicio de sesión exitoso
          this.router.navigate(['/home']).then(() => {
            console.log('Redirigiendo al home');  // Debugging line
          });
        })
        .catch(err => {
          console.log('Error en el inicio de sesión:', err);  // Log the error
          this.handleLoginError(err);  // Llamar a un método para manejar los errores
        });
    } else {
      console.log('El formulario no es válido');  // Log form validation error
    }
  }

  // Maneja el error de inicio de sesión
  handleLoginError(error: any) {
    if (error.code === 'auth/user-not-found') {
      console.log('Usuario no encontrado');
      this.showToast('Usuario no encontrado. Verifica tu email.');
    } else if (error.code === 'auth/wrong-password') {
      console.log('Contraseña incorrecta');
      this.showToast('Contraseña incorrecta. Intenta de nuevo.');
    } else {
      console.log('Error desconocido:', error);
      this.showToast('Usuario o contraseña incorrectos. Intenta nuevamente.');
    }
  }

  // Función para mostrar el toast
  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,  // Duración en milisegundos
      position: 'top',  // Posición del toast (top, bottom, middle)
      color: 'danger',  // Color del toast (puedes cambiarlo a 'dark', 'primary', etc.)
    });
    toast.present();
  }
}
