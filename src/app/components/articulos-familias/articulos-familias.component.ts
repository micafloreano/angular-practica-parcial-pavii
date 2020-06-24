import { Component, OnInit } from '@angular/core';
import { ArticuloFamilia, ArticulosFamilias } from
'../../models/articulo-familia';
import { MockArticulosFamiliasService } from "../../services/mock-articulos-familias.service";
import { ArticulosFamiliasService } from "../../services/articulos-familias.service";


@Component({
  selector: 'app-articulos-familias',
  templateUrl: './articulos-familias.component.html',
  styleUrls: ['./articulos-familias.component.css']
})
export class ArticulosFamiliasComponent implements OnInit {
 Titulo = "Articulos Familias";
 Items: ArticuloFamilia[] = [];

 constructor(private articulosFamiliasService: ArticulosFamiliasService) { } //con esto los datos se traen desde el servidor
 ngOnInit() {
   this.GetFamiliasArticulos();
 }

 GetFamiliasArticulos() {
 this.articulosFamiliasService.get()
 .subscribe((res:ArticuloFamilia[]) => {
 this.Items = res;
 });
 
 }
}
