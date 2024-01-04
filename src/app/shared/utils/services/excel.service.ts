import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  public export(data: any, fileName: string): void {
    const worksheet = this.parseDataToSheet(data);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private parseDataToSheet(data: any): XLSX.WorkSheet {
    const sheetData: any[] = [];
    sheetData.push(['INDICADORES SERVICIO TÉCNICO']);
    sheetData.push([]);
    sheetData.push(['FECHA DESDE', data.dateFrom]);
    sheetData.push(['FECHA HASTA', data.dateUntil]);
    sheetData.push([]);
    sheetData.push([]);
    sheetData.push(['SERVICIOS', data.numberOfServices]);
    sheetData.push(['SERVICIOS REINGRESADOS', data.reentryServices]);
    sheetData.push([]);
    sheetData.push([
      'TIEMPO DE REPARACIÓN (PROMEDIO)',
      `${data.repairTime.averageHours} Horas`,
    ]);
    sheetData.push([]);
    sheetData.push([
      'TIEMPO DE PERMANENCIA (PROMEDIO)',
      `${data.repairTimeOfStay.averageDays} Días`,
    ]);
    sheetData.push([]);
    sheetData.push(['TIPO DE FALLA', '%']);
    data.failureServices.forEach((failureService: any) => {
      sheetData.push([failureService.failure, `${failureService.percentage}%`]);
    });
    sheetData.push([]);
    sheetData.push(['TIPO DE PRODUCTO', '%']);
    data.productTypeServices.forEach((productTypeService: any) => {
      sheetData.push([
        productTypeService.productType,
        `${productTypeService.percentage}%`,
      ]);
    });

    return XLSX.utils.aoa_to_sheet(sheetData);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
