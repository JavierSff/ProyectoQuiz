import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  ionicForm: FormGroup;

  constructor(
    private toastController: ToastController,
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    // Initialize the form with validation rules
    this.ionicForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      contact: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(10),
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$'),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-z\\d$@$!%*?&].{8,}'
          ),
        ],
      ],
    });
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  async signUP() {
    const loading = await this.loadingController.create();
    await loading.present();

    if (this.ionicForm.valid) {
      try {
        const user = await this.authService.registerUser(
          this.ionicForm.value.email,
          this.ionicForm.value.password,
          this.ionicForm.value.fullname
        );

        if (user) {
          loading.dismiss();
          this.router.navigate(['/home']);
        }
      } catch (err) {
        loading.dismiss();
        this.presentToast(err.message || 'An error occurred');
        console.log(err);
      }
    } else {
      loading.dismiss();
      this.presentToast('Please provide all the required values!');
      console.log('Form is invalid!');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'top',
    });
    await toast.present();
  }
}
