import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { GeneralUtilityService } from 'src/app/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { lastValueFrom } from 'rxjs';
import { ApiResponse } from 'src/app/models/api-response.model';
import { NgxUiLoaderModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { hasPermission } from 'src/app/store';

interface SelectedFile {
  file: File;
  url: string;
}

interface Images {
  id: File;
  path: string;
}

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    CKEditorModule,
    NgxUiLoaderModule,
    ImageCropperComponent
  ],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EditProductComponent {


  breadCrumbItems!: Array<{}>;
  categories: any;
  volumes: any;
  product: any;
  parentCategory: any;
  isSubmitted: boolean = false;
  inStock: boolean = false;
  hideButton: number = 0;
  validateMessage: boolean = false;
  selectedFiles: SelectedFile[] = [];
  images: Images[] = [];
  responseImages: string[] = [];
  productId: any;
  public Editor = ClassicEditor;
  productUpdateForm!: FormGroup;
  public editorConfig: any;
  public model = {
    editorData: "",
  };

  imageChangedEvent: any = '';
  croppedImage: any;
  showModal: boolean = false;
  modalImageSrc: string = '';
  cropperAspectRatio: number = 1 / 1;


  @ViewChild('fileInput') fileInput!: ElementRef;

  private productService = inject(ProductService);
  private utilService = inject(GeneralUtilityService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ngxLoader = inject(NgxUiLoaderService);

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "Products", link: "/product" },
      { label: "Edit", active: true },
    ];

    this.productId = this.route.snapshot.paramMap.get('id');
    this.editorConfig = {
      toolbar: {
        items: [
          "heading",
          "|",
          "bold",
          "italic",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "undo",
          "redo",
          "|",
          "link",
        ],
      },
    };

    // Check if CKEditor is loaded
    if (ClassicEditor) {
      // Remove the image upload feature dynamically
      ClassicEditor.defaultConfig = {
        ...ClassicEditor.defaultConfig,
        image: { upload: { enabled: false } },
      };
    }
    this.ngxLoader.start();
    this.getProductDetails(this.productId);
    this.getAllCategories();
    this.getAllVolumes();
    this.productUpdateForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      category: new FormControl("", [Validators.required]),
      volume: new FormControl("", [Validators.required]),
      sku: new FormControl("", [Validators.required]),
      rol: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      qty: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      items: new FormArray([]),
    });
    this.ngxLoader.stop();
  }

  hasPermissionForProduct(permission: string) {
    return hasPermission(permission);
  }

  getAllCategories(pageNumber?: number) {
    this.productService.getAllCategories(pageNumber).subscribe((response) => {
      this.categories = response.data.records;
    });
  }

  getAllVolumes(pageNumber?: number) {
    this.productService.getAllVolumes(pageNumber).subscribe((response) => {
      this.volumes = response.data.records;
    });
  }

  getProductDetails(productId: any) {
    this.ngxLoader.start();
    this.productService.getProductDetails(productId).subscribe((response: ApiResponse) => {
      this.product = response.data;
      this.inStock = response.data.isOutOfStock;
      // console.log(this.product.product.productAdd);

      let itemsForm = <FormArray><unknown>this.productUpdateForm.controls['items'];
      this.product.product.productAdd.forEach((element: any) => {
        itemsForm.push(new FormGroup({
          title: new FormControl(element.title),
          description: new FormControl(element.description),
        }));
      });

      response.data.product.files.forEach((file: any) => {
        this.images.push({ id: file.file.id, path: file.file.path });
      });
      // this.productUpdateForm.value.items = this.product.product.productAdd;
      this.productUpdateForm.patchValue({
        name: this.product.product.name,
        category: this.product.product.category,
        volume: this.product.product.volume,
        sku: this.product.product.sku,
        rol: this.product.product.rol,
        price: this.product.product.sellingPrice,
        qty: this.product.stock.availableQty,
        description: this.product.product.description,
      });
    });
    this.ngxLoader.stop();
  }

  removeCurrentImage(index: number) {
    this.images.splice(index, 1);
  }

  fileChangeEvent(event: any): void {
    if (event && event.target && event.target.files && event.target.files.length > 0) {
      this.imageChangedEvent = event;
      this.setAspectRatio(event);
    }
  }

  setAspectRatio(event: any) {
    const img = new Image();
    img.onload = () => {
      this.cropperAspectRatio = img.width / img.height;
    };
    img.src = event.target.files[0].src;
  }

  imageCropped(event: any) {
    this.croppedImage = event.blob;
  }
  imageLoaded(event: any) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  addCroppedImage() {
    if (this.croppedImage) {
      const croppedFile = new File([this.croppedImage], new Date().toISOString().toString() + '_cropped_image.png', { type: 'image/png' });
      const fileURL = URL.createObjectURL(croppedFile);
      this.selectedFiles.push({ file: croppedFile, url: fileURL });
      this.removeCroppedImageEvent();
    }
  }

  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  removeCroppedImage(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  removeCroppedImageEvent() {
    this.imageChangedEvent = null;
    this.croppedImage = null;
    this.fileInput.nativeElement.value = '';
  }

  openModal(imageSrc: string) {
    this.modalImageSrc = imageSrc;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalImageSrc = '';
  }


  // form array

  getControls() {
    return (this.productUpdateForm.get("items") as FormArray).controls;
  }

  addItemSubForm() {
    return new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
    });
  }

  addInfo() {
    this.hideButton++;
    const form = <FormArray><unknown>this.productUpdateForm.controls['items'];
    form.push(this.addItemSubForm());
  }

  deleteInfo(index: number) {
    this.hideButton--;
    const controls = <FormArray>this.productUpdateForm.get("items");
    controls.removeAt(index);
  }

  async updateProduct() {

    this.validateMessage = false;
    this.isSubmitted = true;
    this.ngxLoader.start();

    if (this.images.length > 0 || this.selectedFiles.length > 0) {
      if (this.productUpdateForm.valid) {
        const formData = new FormData();

        for (const element of this.selectedFiles) {
          formData.append('files', element.file);
        }

        const fileUploadRes$ = this.utilService.fileUpload(formData);
        const fileUploadRes = lastValueFrom(fileUploadRes$);

        fileUploadRes.then((response: ApiResponse) => {

          if (response.data) {
            // this.images = response.data.map((item:any) => ({ id: item.id }));
            response.data.forEach((item: any) => {
              // this.images.push(response.data.map((item:any) => ({ id: item.id })));
              this.images.push({ id: item.id, path: item.path });
            });

            // console.log(this.images);

            const productAddPayload = {
              name: this.productUpdateForm.value.name,
              categoryId: this.productUpdateForm.value.category.id,
              volumeId: this.productUpdateForm.value.volume.id,
              isPack: true,
              isOutOfStock: this.inStock,
              sku: this.productUpdateForm.value.sku,
              rol: this.productUpdateForm.value.rol,
              qty: this.productUpdateForm.value.qty,
              productAdditionalDetails: this.productUpdateForm.value.items ? this.productUpdateForm.value.items : {},
              sellingPrice: parseInt(this.productUpdateForm.value.price),
              files: this.images,
              description: this.model.editorData,
            };

            const productCreateRes$ = this.productService.updateProduct(this.product.product.id, productAddPayload);
            const productCreateRes = lastValueFrom(productCreateRes$);

            productCreateRes.then((response: ApiResponse) => {
              this.isSubmitted = false;
              this.toastr.success("Product updated successfully", "Success!");
              this.router.navigate(['/product']);
            }, (error) => {
              this.isSubmitted = false;
              console.log(error);
            });
          }

        });
      }
    }
    this.ngxLoader.stop();
  }

}
