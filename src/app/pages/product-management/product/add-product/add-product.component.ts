import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { GeneralUtilityService } from "src/app/services/util.service";
import { lastValueFrom } from "rxjs";
import { ApiResponse } from "src/app/models/api-response.model";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { NgxUiLoaderModule, NgxUiLoaderService } from "ngx-ui-loader";
import { ImageCropperComponent } from 'ngx-image-cropper';
import { hasPermission } from "src/app/store";
import { ProductService } from "src/app/services/product.service";
import { HttpClient } from "@angular/common/http";

interface SelectedFile {
  file: File;
  url: string;
}

@Component({
  selector: "app-add-product",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule, 
    FormsModule,
    NgSelectModule,
    CKEditorModule,
    NgxUiLoaderModule,
    ImageCropperComponent,
  ],
  templateUrl: "./add-product.component.html",
  styleUrl: "./add-product.component.scss",
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddProductComponent {
  breadCrumbItems!: Array<{}>;
  categories: any;
  volumes: any;
  parentCategory: any;
  isSubmitted: boolean = false;
  hideButton: number = 0;
  validateMessage: boolean = false;
  selectedFiles: SelectedFile[] = [];
  images: any;
  public Editor = ClassicEditor;
  productAddForm!: FormGroup;
  public editorConfig: any;
  public model = {
    editorData: "",
  };
  imageChangedEvent: any = '';
  croppedImage: any;
  showModal: boolean = false;
  inStock: boolean = false;
  modalImageSrc: string = '';
  cropperAspectRatio: number = 1 / 1;


  @ViewChild('fileInput') fileInput!: ElementRef;

  private productService = inject(ProductService);
  private utilService = inject(GeneralUtilityService);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private ngxLoader = inject(NgxUiLoaderService);

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: "Dashboard" },
      { label: "Products", link: "/product" },
      { label: "Add", active: true },
    ];

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
    //this.getAllCategories();
    this.productAddForm = new FormGroup({
      name: new FormControl("", [Validators.required]),
      price: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),

    });
    this.ngxLoader.stop();
  }

  selectedFile: File | null = null;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadedImageUrl: string | null = null;
  uploadImage: any;
  onSubmit() {
    if (this.selectedFile) {
      console.log('this.selectedFile ============= ', this.selectedFile);

      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.utilService.fileUpload(formData).subscribe({
        next: (response) => {
          this.uploadImage = response.data;
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

  // imageCropped(event: any) {
  //   this.croppedImage = event.blob;
  // }
  // imageLoaded(event: any) {
  //   // show cropper
  // }
  // cropperReady() {
  //   // cropper ready
  // }
  // loadImageFailed() {
  //   // show message
  // }

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
    return (this.productAddForm.get("items") as FormArray).controls;
  }

  addItemSubForm() {
    return new FormGroup({
      title: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
    });
  }

  addInfo() {
    this.hideButton++;
    const form = <FormArray>(<unknown>this.productAddForm.controls["items"]);
    form.push(this.addItemSubForm());
  }

  deleteInfo(index: number) {
    this.hideButton--;
    const controls = <FormArray>this.productAddForm.get("items");
    controls.removeAt(index);
  }

  async addProduct() {

    this.validateMessage = false;
    this.isSubmitted = true;
    this.ngxLoader.start();



    if (this.productAddForm.valid) {
      try {
        const formData = new FormData();

        // Append the files to FormData and upload them
        if (this.uploadImage) {


          const images = [{
            path: this.uploadImage.path,
            id: this.uploadImage.id
          }]


          // Create the product payload
          const productAddPayload = {
            name: this.productAddForm.value.name,
            price: this.productAddForm.value.price,
            description: this.model.editorData,
            files: images,
          };

          // Send the product data to the server
          const productCreateRes$ = this.productService.createProduct(productAddPayload);
          const productCreateRes = await lastValueFrom(productCreateRes$);

          if (productCreateRes) {
            this.isSubmitted = false;
            this.toastr.success("Product added successfully", "Success!");
            this.router.navigate(["/product"]);
          }

        } else {
          this.toastr.error("Please upload an image.", "Error!");
        }
      } catch (error) {
        console.error("Error while adding product:", error);
        this.isSubmitted = false;
        this.toastr.error("An error occurred while adding the product.", "Error!");
      }
    }

    this.ngxLoader.stop();
  }



}
