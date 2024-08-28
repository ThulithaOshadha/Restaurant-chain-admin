export class Query {
    id?: string;
    queryText?: string;
    response?: string | null;
    user?: QueryUser;
    status?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class QueryUser {
    id?: string;
    name?: string;
    concatNo?: string;
    email?: string;
}

