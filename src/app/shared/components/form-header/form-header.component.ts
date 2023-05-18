import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sos-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.scss']
})
export class FormHeaderComponent implements OnInit {
  @Input() headerLabel: string = 'Header';

  constructor() { }

  ngOnInit(): void {
  }

}
