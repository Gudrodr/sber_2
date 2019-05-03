import { Action } from './actions';

export interface AdvertData {
    authorId: number | undefined;
    title: string;
    description: string;
    phone: string;
    city: string;
    picture: string;
}

export interface AuthorData {
    id: number;
    author: string;
}

export interface StoreState {
    adverts: AdvertData[];
    authors: AuthorData[];
    editorStatus: boolean;
    itemIndex: number | undefined;
    loading: boolean;
    lastId: number;
    currentPage: number;
}

export type Dispatch = (action: Action) => void;