import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MachinelistComponent } from './machine/machinelist/machinelist.component';
import { NewMachineComponent} from './machine/new-machine/new-machine.component'
import { MachineService } from './machine/machine.service';
import { RouterModule } from '@angular/router';
import { MachinedetailsComponent } from './machine/machinedetails/machinedetails.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UserService } from './users/user.service';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { PageHeaderComponent } from './page-header/page-header.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ApplicationService } from './applications/application.service';
import { NewApplicationComponent } from './applications/new-application/new-application.component';
import { ApplicationDetailsComponent } from './applications/application-details/application-details.component';
import { ApplicationListComponent } from './applications/application-list/application-list.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { CredentialService } from './credentials/credential.service';
import { CredentialListComponent } from './credentials/credential-list/credential-list.component';
import { NewCredentialComponent } from './credentials/new-credential/new-credential.component';
import { CredentialDetailsComponent } from './credentials/credential-details/credential-details.component';
import { NewUserComponent } from './users/new-user/new-user.component';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
import { ScriptService } from './script/script.service';
import { NewScriptComponent } from './script/new-script/new-script.component';
import { NewAlertComponent } from './alerts/new-alert/new-alert.component';
import { AlertPolicyListComponent } from './alerts/alert-policy-list/alert-policy-list.component';
import { AlertListComponent } from './alerts/alert-list/alert-list.component';
import { NewWindowsServiceAlertComponent } from './alerts/new-windows-service-alert/new-windows-service-alert.component';
import { IntegrationService } from './integrations/integration.service';
import { NewSlackIntegrationComponent } from './integrations/new-slack-integration/new-slack-integration.component';
import { AlertPolicyDetailsComponent } from './alerts/alert-policy-details/alert-policy-details.component';
import { AlertDetailsComponent } from './alerts/alert-details/alert-details.component';
import { ScriptListComponent } from './script/script-list/script-list.component';
import { ScriptDetailsComponent } from './script/script-details/script-details.component';
import { JobDetailsComponent } from './jobs/job-details/job-details.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { NewJobComponent } from './jobs/new-job/new-job.component';
import { JobService } from './jobs/jobs.service';
import { RunScriptJobComponent } from './jobs/run-script-job/run-script-job.component';
import { NewProcessAlertComponent } from './alerts/new-process-alert/new-process-alert.component';
import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from "./auth/auth-interceptor";
import { AuthGuard } from './auth/auth.guard';
import { IntegrationListComponent } from './integrations/integration-list/integration-list.component';
import { IntegrationDetailComponent } from './integrations/integration-detail/integration-detail.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { DashboardService } from './dashboard/dashboard.service';

@NgModule({
  declarations: [
    AppComponent,
    MachinelistComponent,
    MachinedetailsComponent,
    NewMachineComponent,
    PageHeaderComponent,
    NewApplicationComponent,
    ApplicationDetailsComponent,
    ApplicationListComponent,
    UserListComponent,
    CredentialListComponent,
    NewCredentialComponent,
    CredentialDetailsComponent,
    NewUserComponent,
    LoginComponent,
    NewScriptComponent,
    NewAlertComponent,
    AlertPolicyListComponent,
    AlertListComponent,
    NewWindowsServiceAlertComponent,
    NewSlackIntegrationComponent,
    AlertPolicyDetailsComponent,
    AlertDetailsComponent,
    ScriptListComponent,
    ScriptDetailsComponent,
    JobDetailsComponent,
    JobListComponent,
    NewJobComponent,
    RunScriptJobComponent,
    NewProcessAlertComponent,
    IntegrationListComponent,
    IntegrationDetailComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    RouterModule.forRoot([
      {
        path: 'machines/new',
        component: NewMachineComponent
      },
      {
        path: 'applications/new',
        component: NewApplicationComponent
      },
      {
        path: 'credentials/new',
        component: NewCredentialComponent
      },
      {
        path: 'alerts/new-disk-space',
        component: NewAlertComponent
      },
      {
        path: 'alerts/new/process',
        component: NewProcessAlertComponent
      },
      {
        path: 'alerts/new-windows-service',
        component: NewWindowsServiceAlertComponent
      },
      {
        path: 'integrations/new-slack',
        component: NewSlackIntegrationComponent
      },
      {
        path: 'scripts/new',
        component: NewScriptComponent
      },
      {
        path: 'jobs/new',
        component: NewJobComponent
      },
      {
        path: 'jobs/new/script',
        component: RunScriptJobComponent
      },
      {
        path: 'applications/:id',
        component: ApplicationDetailsComponent
      },
      {
        path: 'machines/:id',
        component: MachinedetailsComponent
      },
      {
        path: 'scripts/:id',
        component: ScriptDetailsComponent
      },
      {
        path: 'alertpolicies/:id',
        component: AlertPolicyDetailsComponent
      },
      {
        path: 'jobs/:id',
        component: JobDetailsComponent
      },
      {
        path: 'credentials/:id',
        component: CredentialDetailsComponent
      },
      {
        path: 'integrations/:id',
        component: IntegrationDetailComponent
      },
      {
        path: 'alerts/:id',
        component: AlertDetailsComponent
      },
      {
        path: 'users',
        component: UserListComponent
      },
      {
        path: 'scripts',
        component: ScriptListComponent
      },
      {
        path: 'integrations',
        component: IntegrationListComponent
      },
      {
        path: 'jobs',
        component: JobListComponent
      },
      {
        path: 'alertpolicies',
        component: AlertPolicyListComponent
      },
      {
        path: 'alerts',
        component: AlertListComponent
      },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'credentials',
        component: CredentialListComponent
      },
      {
        path: 'applications',
        component: ApplicationListComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'machines',
        component: MachinelistComponent
      },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ]),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    MachineService, UserService, ApplicationService, CredentialService, ScriptService, IntegrationService, JobService, DashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }