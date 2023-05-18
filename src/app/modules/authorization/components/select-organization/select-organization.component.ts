import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { Organization } from 'src/app/core/models/organization';
import { AuthService } from 'src/app/core/services/auth.service';
import { OrganizationService } from 'src/app/core/services/organization.service';
import { GenericComponent } from 'src/app/shared/components/generic.component';
import { MESSAGE_TYPE } from 'src/app/shared/constants/helper.constants';
import { LOCAL_STORAGE } from '../../../../shared/constants/local-storage.contants';

@Component({
  selector: 'sos-select-organization',
  templateUrl: './select-organization.component.html',
  styleUrls: ['./select-organization.component.scss']
})
export class SelectOrganizationComponent extends GenericComponent {
  selectedValue = null;
  rememberOrganization: boolean = false;

  constructor(private authService: AuthService,
    private router: Router,
    public organizationService: OrganizationService,
    message: NzMessageService,
    modal: NzModalService) { 
      super(message, modal);
    }

  data: Organization[] = [];

  gridStyle = {
    width: '25%',
    textAlign: 'center'
  };

  override ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    let currentUser = this.authService.currentUserValue;
    // Todo: Refactor and place the data in 'store'
    currentUser?.userLicences.forEach(item => {
      let serviceObserver = this.organizationService.getOrganizationById(item.organizationId);
      serviceObserver.subscribe((response: { success: any; result: Organization | null; }) => {
        if(response.success && response.result !== null) {
          this.data.push(response.result);
          this.data = this.sortData(this.data); // To do: Refactor this. Wrong place to place sorting
        }
      });
    });
    
  }

  sortData(dataArray: Organization[]) {
    return dataArray.sort((a,b) => (a.organizationName > b.organizationName) ? 1 : ((b.organizationName > a.organizationName) ? -1 : 0));
  }

  onSelect() {
    if(this.selectedValue !== null) {
      localStorage.setItem(LOCAL_STORAGE.REMEMBER_MY_ORGANIZATION, this.rememberOrganization.toString());
      if(this.rememberOrganization) {
        localStorage.setItem(LOCAL_STORAGE.ORGANIZATION_ID, this.selectedValue);
      }
      this.authService.loggedIn.next(true);
      this.authService.organizationId.next(this.selectedValue);
      this.router.navigate(['/sync']);
    }
  }

}
