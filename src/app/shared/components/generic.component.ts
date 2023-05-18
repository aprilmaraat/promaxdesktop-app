import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { isNonEmptyString } from 'ng-zorro-antd/core/util';
import { ipcRenderer } from 'electron';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { IPC } from '../constants/helper.constants';


@Component({
  selector: '',
  template: ''
})
export class GenericComponent implements OnInit, OnDestroy, OnChanges {
  ipcRenderer!: typeof ipcRenderer;
  windowsSize = {};
  generalLoading: boolean = false;
  submitWait: boolean = false;

  constructor(public message: NzMessageService, public modal: NzModalService) { 
    this.ipcRenderer = window.require('electron').ipcRenderer;
    this.submitWait = false;
  }

  ngOnInit(): void { 
  }

  isNonEmptyString(text: string): boolean {
    return isNonEmptyString(text);
  }

  setWindowSize() {
    this.ipcRenderer.send(IPC.SET_WINDOW_SIZE, this.windowsSize);
  }

  federateSearch(keyword: string, callback: (param: string) => void) {
    callback(keyword);
  }

  showMessage(type: string, text: string) {
    this.message.create(type, text);
  }

  ngOnChanges(changes: SimpleChanges): void { }

  ngOnDestroy(): void { }

}