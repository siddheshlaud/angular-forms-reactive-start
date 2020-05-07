import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  forbiddenNamesArr=['Chris', 'Anna'];

  signupForm: FormGroup;

  ngOnInit() {
    this.signupForm = new FormGroup({
      'userData': new FormGroup({
        'username': new FormControl(null, [Validators.required, this.forbiddenNames.bind(this)]), //bind(this) is required as Angular will be executing the validator and we are using this in code
        'email': new FormControl(null, [Validators.required, Validators.email],[this.forbiddenEmailAsync]) //1. Defaults, 2. Normal Validators (Sync), 3. Async Validators
      }),
      'gender': new FormControl('female'),
      'hobbies': new FormArray([])
    });

    this.signupForm.valueChanges.subscribe(
      (value) => {
        console.log(value);
      }
    );

    this.signupForm.statusChanges.subscribe(
      (status) => {
        console.log(status);
      }
    );

    // this.signupForm.setValue({
    //   'userData': {
    //     'username': 'Siddhesh',
    //     'email': 'abc@xyz.com'
    //   },
    //   'gender': 'male',
    //   'hobbies': []
    // });
    // this.signupForm.patchValue({
    //   'userData': {
    //     'username': 'Sidd'
    //   }
    // });
  }

  onSubmit() {
    this.signupForm.reset();
    console.log(this.signupForm);
  }

  onAddHobby() {
    const hobby = new FormControl(null, Validators.required);
    (<FormArray>this.signupForm.get('hobbies')).push(hobby);
  }

  //{[s:string]: boolean} JSON object of type where key will be of data type string and value of boolean
  forbiddenNames(control: FormControl): {[s:string]: boolean} 
  { 
    if(this.forbiddenNamesArr.indexOf(control.value) !== -1) {
      return {'nameIsForbidden': true};
    }
    return null; // If FormControl is valid then null needs to be sent
  }

  forbiddenEmailAsync(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise((resolve, reject)=>{
      setTimeout(()=>{
        if(control.value === 'test@test.com') {
          resolve({'emailIsForbidded': true}); // Invalid Control Value
        } else {
          resolve(null); // Valid control value
        }
      },1500);
    });

    return promise;
  }


}
