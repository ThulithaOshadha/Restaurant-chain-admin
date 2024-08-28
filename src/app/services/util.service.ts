import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { UtilRoutes } from '../routes/util-rotes';
// import { v4 as uuidv4 } from 'uuid';
 
/**
 * A utility service providing general-purpose methods for common tasks.
 * These methods include enum manipulation, pagination text generation,
 * query parameter string creation, and form validation message retrieval.
 *
 * @company Webmotech (PVT) Ltd.
 * @author Tharindu Chamikara
 * @date 2024-03-17
 */

 const fileUploadMultipleURL = UtilRoutes.fileUploadURL;


@Injectable({ providedIn: 'root' })
export class GeneralUtilityService {

 private http = inject(HttpClient);
 
    /**
     * Converts an enum object into a list of key-value pairs.
     * @param enumObj The enum object to convert.
     * @returns An array of key-value pairs representing the enum.
     */
    enumToList(enumObj: any): { key: string; value: number }[] {
        let list: { key: any; value: any }[] = [];
        for (const [key, value] of Object.entries(enumObj)) {
            if (isNaN(Number(key))) {
                list.push({
                    key: key,
                    value: value,
                })
            }
        }
        return list;
    }
 
    /**
     * Generates a string representing the pagination entry range.
     * @param currentPage The current page number.
     * @param pageSize The number of items per page.
     * @param totalCount The total number of items.
     * @returns A string indicating the range of displayed entries.
     */
    getTblPaginationEntryRange(currentPage: number, pageSize: number, totalCount: number): string {
        const startEntryIndex = (currentPage - 1) * pageSize + 1;
        const endEntryIndex = Math.min(currentPage * pageSize, totalCount);
        return `Showing ${startEntryIndex} to ${endEntryIndex} of ${totalCount} entries`;
    }
 
    /**
     * Generates a query parameter string from an object.
     * @param queryParams An object containing query parameters.
     * @returns A string representing the query parameters.
     */
    getQueryParamString(queryParams?: { [key: string]: any }) {
        let params = new HttpParams();
        for (let key in queryParams) {
            if (queryParams.hasOwnProperty(key)) {
                params = params.append(key, queryParams[key]);
            }
        }
        return '?' + params.toString();
    }
 
    /**
     * Retrieves the validation message for a form control.
     * @param controlName The name of the form control.
     * @param form The form group containing the control.
     * @returns The validation message for the control.
     */
    getValidationMessage(controlName: string, form: any): string {
        const control = form.get(controlName);
        if (control.touched && control.invalid) {
            if (control.errors.required) {
                return 'This field is required.';
            } else if (control.errors.email) {
                return 'Invalid email format.';
            } else if (control.errors.minlength) {
                return `Minimum length ${control.errors.minlength.requiredLength}.`;
            }
        }
        return '';
    }

    imageUrlToBase64(url: string) {
        let dataU = '';
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Set crossOrigin property to handle CORS issues
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx!.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png'); 
          dataU = dataURL; // You can change 'image/png' to 'image/jpeg' if needed
        //   console.log(dataURL); // Base64-encoded image data
       
        };
        img.src = url;
         
        this.base64toFile(dataU);
      }

      base64toFile(dataURL:any) { 
        console.log(dataURL);
        
        let dataurl =  dataURL;
        let filename = 'test.jpeg';
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: 'mime' });
        return new File([blob], filename);
      }

    //   base64toFile(base64String: any): File {
    //     let filename = 'test.jpeg'
    //     const byteCharacters = atob(base64String);
    //     const byteNumbers = new Array(byteCharacters.length);
    //     for (let i = 0; i < byteCharacters.length; i++) {
    //       byteNumbers[i] = byteCharacters.charCodeAt(i);
    //     }
    //     const byteArray = new Uint8Array(byteNumbers);
    //     const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    //     return new File([blob], filename);
    //   }
 
    fileUpload(data: FormData): Observable<ApiResponse> {
        console.log('data ========file=========== ',data);
        
        return this.http.post<ApiResponse>(fileUploadMultipleURL, data);
    }
}