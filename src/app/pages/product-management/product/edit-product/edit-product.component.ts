import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ProductService } from 'src/app/services/product.service';

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

    this.ngxLoader.start();
    this.getProductDetails(this.productId);
    // this.getAllCategories();
    this.productUpdateForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
    });
    this.ngxLoader.stop();
  }

  uploadedImageUrl: string | null = null;
  uploadImage: any;
  newUploadedImage: any;

  onSubmit() {
    if (this.selectedFile) {
      console.log('this.selectedFile ============= ', this.selectedFile);

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.utilService.fileUpload(formData).subscribe({
        next: (response) => {
          this.newUploadedImage = response.data;
          this.uploadedImageUrl = response.data.path;
          console.log('File uploaded successfully', response);
          console.log('File uploaded uploadedImageUrl', this.uploadedImageUrl);
        },
        error: (err) => {
          console.error('Upload failed', err);
        }
      });
    } else {
      console.error('No file selected!');
    }
  }

  hasPermissionForProduct(permission: string) {
    return hasPermission(permission);
  }




  getProductDetails(productId: any) {
    this.ngxLoader.start();
    this.productService.getProductDetails(productId).subscribe((response: ApiResponse) => {

      this.product = response.data;
      response.data.files.forEach((file: any) => {
        this.images.push({ id: file.id, path: file.path });
      });


      this.productUpdateForm.patchValue({
        name: this.product.name,
        price: this.product.price,
        description: this.product.description,
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

  selectedFile: File | null = null;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }



  async updateProduct() {

    this.validateMessage = false;
    this.isSubmitted = true;
    this.ngxLoader.start();

    if (this.productUpdateForm.valid) {

      const formData = new FormData();
      //let images;
      if (this.newUploadedImage) {
        this.images.push({id: this.newUploadedImage.id, path: this.newUploadedImage.path})
      }

      const productAddPayload = {
        name: this.productUpdateForm.value.name,
        price: parseInt(this.productUpdateForm.value.price),
        files: this.images,
        description: this.model.editorData,
      };

      const productCreateRes$ = this.productService.updateProduct(this.product.id, productAddPayload);
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

    this.ngxLoader.stop();
  }

}
