import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'scan',
    loadChildren: () => import('./scan/scan.module').then( m => m.ScanPageModule)
  },
  {
    path: 'security-check',
    loadChildren: () => import('./security-check/security-check.module').then( m => m.SecurityCheckPageModule)
  },
  {
    path: 'washbay-inspection',
    loadChildren: () => import('./washbay-inspection/washbay-inspection.module').then( m => m.WashbayInspectionPageModule)
  },
  {
    path: 'equipment-inspection',
    loadChildren: () => import('./equipment-inspection/equipment-inspection.module').then( m => m.EquipmentInspectionPageModule)
  },
  {
    path: 'workshop-inspection',
    loadChildren: () => import('./workshop-inspection/workshop-inspection.module').then( m => m.WorkshopInspectionPageModule)
  },
  {
    path: 'tyrebay-inspection',
    loadChildren: () => import('./tyrebay-inspection/tyrebay-inspection.module').then( m => m.TyrebayInspectionPageModule)
  },
  {
    path: 'dieselbay-inspection',
    loadChildren: () => import('./dieselbay-inspection/dieselbay-inspection.module').then( m => m.DieselbayInspectionPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'washbay-truck',
    loadChildren: () => import('./washbay-truck/washbay-truck.module').then( m => m.WashbayTruckPageModule)
  },
  {
    path: 'washbay-trailer',
    loadChildren: () => import('./washbay-trailer/washbay-trailer.module').then( m => m.WashbayTrailerPageModule)
  },
  {
    path: 'workshop-truck',
    loadChildren: () => import('./workshop-truck/workshop-truck.module').then( m => m.WorkshopTruckPageModule)
  },
  {
    path: 'workshop-trailer',
    loadChildren: () => import('./workshop-trailer/workshop-trailer.module').then( m => m.WorkshopTrailerPageModule)
  },
  {
    path: 'equipment-scan',
    loadChildren: () => import('./equipment-scan/equipment-scan.module').then( m => m.EquipmentScanPageModule)
  },
  {
    path: 'tyrebay-truck',
    loadChildren: () => import('./tyrebay-truck/tyrebay-truck.module').then( m => m.TyrebayTruckPageModule)
  },
  {
    path: 'tyrebay-trailer',
    loadChildren: () => import('./tyrebay-trailer/tyrebay-trailer.module').then( m => m.TyrebayTrailerPageModule)
  },
  {
    path: 'trip-sheet',
    loadChildren: () => import('./trip-sheet/trip-sheet.module').then( m => m.TripSheetPageModule)
  },
  {
    path: 'fuel-record',
    loadChildren: () => import('./fuel-record/fuel-record.module').then( m => m.FuelRecordPageModule)
  },
  {
    path: 'dieselbay-scan',
    loadChildren: () => import('./dieselbay-scan/dieselbay-scan.module').then( m => m.DieselbayScanPageModule)
  },
  {
    path: 'checkin',
    loadChildren: () => import('./checkin/checkin.module').then( m => m.CheckinPageModule)
  },
  {
    path: 'checkout',
    loadChildren: () => import('./checkout/checkout.module').then( m => m.CheckoutPageModule)
  },
  {
    path: 'request-auth',
    loadChildren: () => import('./request-auth/request-auth.module').then( m => m.RequestAuthPageModule)
  },
  {
    path: 'deviations',
    loadChildren: () => import('./deviations/deviations.module').then( m => m.DeviationsPageModule)
  },
  {
    path: 'authorise',
    loadChildren: () => import('./authorise/authorise.module').then( m => m.AuthorisePageModule)
  },
  {
    path: 'start-order',
    loadChildren: () => import('./start-order/start-order.module').then( m => m.StartOrderPageModule)
  },
  {
    path: 'order-tracking',
    loadChildren: () => import('./order-tracking/order-tracking.module').then( m => m.OrderTrackingPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
