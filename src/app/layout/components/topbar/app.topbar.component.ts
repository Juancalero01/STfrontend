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
    />
  `,
})
export class AppTopbarComponent {
  constructor(
    private readonly tokenService: TokenService,
    private readonly route: Router
  ) {}

  items: MenuItem[] = [
    // todo: VERIFICAR PORQUE NO TRAE EL ROL
    {
      label: `${this.tokenService
        .getUserFullname()
        ?.toUpperCase()} \n ${this.tokenService.getUserRole()?.toUpperCase()}`,
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Perfil',
          icon: 'pi pi-fw pi-user',
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
      ],
    },
    {
      label: 'Producción',
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: 'Productos',
          icon: 'pi pi-fw pi-box',
          routerLink: ['product'],
        },
        {
          label: 'Tipo de productos',
          icon: 'pi pi-fw pi-tags',
          routerLink: ['product/type'],
        },
      ],
    },

    {
      label: 'Clientes',
      icon: 'pi pi-fw pi-users',
      routerLink: ['client'],
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-fw pi-users',
      routerLink: ['user'],
    },
  ];
}
