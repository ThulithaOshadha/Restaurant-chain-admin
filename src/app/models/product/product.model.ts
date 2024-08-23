export class Product {
    id?: number;
    name?: string;
    category?:Category[];
    createdAt?: string;
    deletedAt?: string;
}

export class Category {
    id?:number;
    name?:string;
    parentId?:string;
    status?:number;
    description?:string;
    createdAt?:string;
    updatedAt?:string;
    deletedAt?:string;
}
  