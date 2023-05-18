import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { REGISTER_STEPS, STEPS_STAGES } from '../../constants/form.constants';

@Component({
  selector: 'sos-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss']
})
export class StepsComponent implements OnInit {
  @Input() currentStepIndex: number = 0;
  @Input() steps: { description: string }[] = [];

  constructor() { 
    // this.steps = [
    //   {
    //     description: 'Create Account'
    //   },
    //   {
    //     description: 'Provide Contact Information'
    //   },
    //   {
    //     description: 'EULA'
    //   }
    // ];
  }

  ngOnInit(): void {}
  
  stepTitle(data: string): string {
    let item = this.steps.find(x => x.description === data);
    if(item !== undefined) {
      let index = this.steps.indexOf(item);
      if(index === this.currentStepIndex) {
        return STEPS_STAGES.inProgress;
      } else if(index > this.currentStepIndex) {
        return STEPS_STAGES.waiting;
      } else {
        return STEPS_STAGES.completed;
      }
    }
    return '*Error*';
  }

}
