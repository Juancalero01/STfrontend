import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-topbar',
  template: `
    <p-menubar
      [model]="items"
      class="flex-"
      styleClass="bg-white border-none border-noround shadow-1 w-full text-sm"
    />
  `,
})
export class AppTopbarComponent {
  items: MenuItem[] = [
    {
      label: 'FERNANDO MARTINEZ',
      icon: 'pi pi-fw pi-user',
      items: [
        {
          label: 'Cerrar Sesión',
          icon: 'pi pi-fw pi-sign-out',
          routerLink: ['/'],
        },
      ],
    },
    {
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      routerLink: ['/'],
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
      label: 'Productos',
      icon: 'pi pi-fw pi-cog',
      items: [
        {
          label: 'Inventario',
          icon: 'pi pi-fw pi-box',
          routerLink: ['product'],
        },
        {
          label: 'Categorías',
          icon: 'pi pi-fw pi-tags',
          routerLink: ['product-type'],
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
      routerLink: ['users'],
    },
  ];
}
