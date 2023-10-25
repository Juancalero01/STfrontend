import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  template: `
    <p-menubar
      [model]="items"
      styleClass="bg-white border-none border-noround shadow-1 w-full text-sm"
    />
  `,
})
export class AppTopbarComponent {
  items: MenuItem[] = [
    {
      label: 'CONTROLNET S.A.',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Perfil',
          icon: 'pi pi-fw pi-user',
          routerLink: ['/'],
        },
        {
          label: 'Cerrar Sesión',
          icon: 'pi pi-fw pi-sign-out',
          routerLink: ['/'],
        },
      ],
    },
    {
      label: 'Servicio Técnico',
      icon: 'pi pi-fw pi-wrench',
      routerLink: ['/'],
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
          label: 'Tipo de Productos',
          icon: 'pi pi-fw pi-tags',
          routerLink: ['product-type'],
        },
      ],
    },

    {
      label: 'Clientes',
      icon: 'pi pi-fw pi-users',
      routerLink: ['/client'],
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-fw pi-users',
      routerLink: ['/users'],
    },
  ];
}
