import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Academie } from '../../_model/academie.model';
import { FileHandle } from '../../_model/file-handle.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessingImageService {
  constructor(private sanitizer: DomSanitizer) { }

  public createImage(academie:Academie){
    const academieImage: any[] =academie.images;
    console.log(academie);
    const academieImagesToFileHandle: FileHandle[]=[];
    for (let i = 0; i < academieImage.length; i++) {
      const imageFileData = academieImage[i];
      const imageBlob=this.dataURIToBlob(imageFileData.imageData,imageFileData.type);
      const imageFile=new File([imageBlob],imageFileData.name,{type : imageFileData.type});
      const finalFileHandle : FileHandle={
        file : imageFile,
        url : this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(imageFile))
      };
      
      academieImagesToFileHandle.push(finalFileHandle);
    
    }
    academie.images=academieImagesToFileHandle;
    return academie;
  }
  

  public dataURIToBlob(picByte:any,imageType:any){
    const byteString=window.atob(picByte);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for(let i = 0 ; i<byteString.length;i++){
      int8Array[i]=byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array],{type:imageType});
    return blob;
  }
}
