export class Product {
    id?: number;
    name?: string;
    status?: boolean;
    price?: number;
    description?: string;
    files?: any;
    category?: Category[] | null;
    createdAt?: string;
    deletedAt?: string;
}

export class Category {
    id?: number;
    name?: string;
    parentId?: string;
    status?: number;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
