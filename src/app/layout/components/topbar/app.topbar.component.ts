import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TokenService } from 'src/app/demo/api/services/token.service';

@Component({
  selector: 'app-topbar',
  template: `
    <p-menubar
      [model]="items"
      class="flex"
      styleClass="bg-white border-none border-noround shadow-1 w-full text-sm"
    >
      <ng-template pTemplate="end">
        <img src="../../../../assets/logo.svg" height="32" /> </ng-template
    ></p-menubar>
  `,
})
export class AppTopbarComponent {
  constructor(
    private readonly tokenService: TokenService,
    private readonly route: Router
  ) {}

  items: MenuItem[] = [
    {
      label: `${this.tokenService.getUserFullname()?.toUpperCase()}`,
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Mi Perfil',
          icon: 'pi pi-fw pi-user',
          routerLink: 'user/profile',
        },
        {
          label: 'Cerrar Sesión',
          icon: 'pi pi-fw pi-sign-out',
          command: () => {
            this.tokenService.deleteToken();
            this.route.navigate(['/auth/login']);
          },
        },
      ],
    },
    {
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/cnet'],
    },
    {
      label: 'Servicio Técnico',
      icon: 'pi pi-fw pi-wrench',
      items: [
        {
          label: 'Ingresos',
          icon: 'pi pi-fw pi-plus',
          routerLink: ['support'],
        },
        {
          label: 'Historial',
          icon: 'pi pi-fw pi-clock',
          routerLink: ['support/history'],
        },
        {
          label: 'Fallas',
          icon: 'pi pi-fw pi-exclamation-triangle',
          routerLink: ['support/failure'],
        },
        {
          label: 'Indicadores',
          icon: 'pi pi-fw pi-chart-bar',
          routerLink: ['support/indicator'],
          visible: this.tokenService.isAdmin(),
        },
      ],
    },
    {
      label: 'Producción',
      icon: 'pi pi-fw pi-box',
      items: [
        {
          label: 'Productos',
          icon: 'pi pi-fw pi-tag',
          routerLink: ['product'],
          visible: this.tokenService.isAdmin(),
        },
        {
          label: 'Tipo de productos',
          icon: 'pi pi-fw pi-tags',
          routerLink: ['product/type'],
          visible: this.tokenService.isAdmin(),
        },
      ],
      visible: this.tokenService.isAdmin(),
    },

    {
      label: 'Clientes',
      icon: 'pi pi-fw pi-users',
      routerLink: ['client'],
      visible: this.tokenService.isAdmin(),
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-fw pi-users',
      routerLink: ['user'],
      visible: this.tokenService.isAdmin(),
    },
  ];
}
