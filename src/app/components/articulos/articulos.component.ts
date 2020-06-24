import { Component, OnInit } from "@angular/core";
import { Articulo } from "../../models/articulo";
import { ArticuloFamilia } from "../../models/articulo-familia";
import { MockArticulosService } from "../../services/mock-articulos.service";
import { MockArticulosFamiliasService } from "../../services/mock-articulos-familias.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-articulos",
  templateUrl: "./articulos.component.html",
  styleUrls: ["./articulos.component.css"]
})
export class ArticulosComponent implements OnInit {
  Titulo = "Articulos"; // inicia mostrando el Listado
  TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC = "L"; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };

  Lista: Articulo[] = [];
  RegistrosTotal: number;
  Familias: ArticuloFamilia[] = [];
  SinBusquedas = true;

  PaginaActual = 1; // inicia pagina 1

  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: "" },
    { Id: true, Nombre: "SI" },
    { Id: false, Nombre: "NO" }
  ];

  FormFiltro: FormGroup;
  FormReg: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private articulosService: MockArticulosService,
    private articulosFamiliasService: MockArticulosFamiliasService,
    // private articulosService: ArticulosService,
    //private articulosFamiliasService: ArticulosFamiliasService,
  ) {}

  ngOnInit() {
    this.FormFiltro = this.formBuilder.group({
      Nombre: [""],
      Activo: [null]
    });
    this.FormReg = this.formBuilder.group({
      IdArticulo: [0],
      Nombre: [
        "",
        [Validators.required, Validators.minLength(4), Validators.maxLength(55)]
      ],
      Precio: [null, [Validators.required, Validators.pattern("[0-9]{1,7}")]],
      Stock: [null, [Validators.required, Validators.pattern("[0-9]{1,7}")]],
      CodigoDeBarra: [
        "",
        [Validators.required, Validators.pattern("[0-9]{13}")]
      ],
      IdArticuloFamilia: ["", [Validators.required]],
      FechaAlta: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}"
          )
        ]
      ],
      Activo: [false]
    });

    this.GetFamiliasArticulos();
  }

  GetFamiliasArticulos() {
    this.articulosFamiliasService.get().subscribe((res: ArticuloFamilia[]) => {
      this.Familias = res;
    });
  }

  Agregar() {
    this.AccionABMC = "A";
    this.submitted = false;
    this.FormReg.reset();
    // valores por defecto que no lo toma luego del reset
    this.FormReg.value.Activo = true;
    this.FormReg.value.IdArticuloId = 0;
    this.FormReg.markAsPristine();
    this.FormReg.markAsUntouched();
  }

  // Buscar segun los filtros, establecidos en FormReg
  Buscar() {
    this.SinBusquedas = false;

    this.articulosService
      .get(this.FormFiltro.value.Nombre, this.FormFiltro.value.Activo, this.PaginaActual)
      .subscribe((res: any) => {
        this.Lista = res.Lista;
        this.RegistrosTotal = res.RegistrosTotal;
      });
  }

  // Obtengo un registro especifico según el Id
  BuscarPorId(Dto, AccionABMC) {
    window.scroll(0, 0); // ir al incio del scroll
    this.articulosService.getById(Dto.IdArticulo).subscribe((res: any) => {
      const itemCopy = { ...res }; // hacemos copia para no modificar el array original del mock

      //formatear fecha de ISO 8061 a string dd/MM/yyyy
      var arrFecha = itemCopy.FechaAlta.substr(0, 10).split("-");
      itemCopy.FechaAlta = arrFecha[2] + "/" + arrFecha[1] + "/" + arrFecha[0];
      this.FormReg.patchValue(itemCopy);
      this.AccionABMC = AccionABMC;
    });
  }

  Consultar(Dto) {
    this.BuscarPorId(Dto, "C");
  }
  // comienza la modificacion, luego la confirma con el metodo Grabar
  Modificar(Dto) {
    if (!Dto.Activo) {
      alert("No puede modificarse un registro Inactivo.");
      return;
    }
    this.BuscarPorId(Dto, "M");
  }
  // grabar tanto altas como modificaciones
  Grabar() {
    alert("Registro Grabado!");
    this.Volver();
  }
  ActivarDesactivar(Dto) {
    var resp = confirm(
      "Esta seguro de " +
        (Dto.Activo ? "desactivar" : "activar") +
        " este registro?"
    );
    if (resp === true) {
      this.articulosService
        .delete(Dto.IdArticulo)
        .subscribe((res: any) => this.Buscar());
    }
  }
  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }
  ImprimirListado() {
    alert("Sin desarrollar...");
  }
}
