import { AdvertData, AuthorData } from './type';


interface SetEditorStatus {
    type: 'SET_EDITOR_STATUS';
    editorStatus: boolean;
}

interface SetItemIndex {
    type: 'SET_ITEM_INDEX';
    itemIndex: number | undefined;
}

interface SetAdverts {
    type: 'SET_ADVERTS';
    adverts: AdvertData[];
}

interface SetAuthors {
    type: 'SET_AUTHORS';
    authors: AuthorData[];
    id: number;
}

interface GetAuthors {
    type: 'GET_AUTHORS';
    authors: AuthorData[];
}

interface SetLoading {
    type: 'SET_LOADING';
    loading: boolean;
}

interface SetLastId {
    type: 'SET_LAST_ID';
    lastId: number;
}

interface SetCurrentPage {
    type: 'SET_CURRENT_PAGE';
    currentPage: number;
}

export type Action =
    SetEditorStatus |
    SetItemIndex |
    SetAdverts |
    SetAuthors |
    GetAuthors |
    SetLoading |
    SetLastId | 
    SetCurrentPage;

export default Action;

export const setEditorStatus = (status: boolean): Action => {
    return {
        type: 'SET_EDITOR_STATUS',
        editorStatus: status
    }
}

export const setItemIndex = (index: number | undefined): Action => {
    return {
        type: 'SET_ITEM_INDEX',
        itemIndex: index
    }
}

export const setAdverts = (items: AdvertData[]): Action => {
    return {
        type: 'SET_ADVERTS',
        adverts: items
    }
}

export const setAuthors = (items: AuthorData[], lastId: number): Action => {
    return {
        type: 'SET_AUTHORS',
        authors: items,
        id: lastId
    }
}

export const getAuthors = (items: AuthorData[]): Action => {
    return {
        type: 'GET_AUTHORS',
        authors: items
    }
}

export const setLoading = (value: boolean): Action => {
    return {
        type: 'SET_LOADING',
        loading: value
    }
}

export const setLastId = (id: number): Action => {
    return {
        type: 'SET_LAST_ID',
        lastId: id
    }
}

export const setCurrentPage = (page: number): Action => {
    return {
        type: 'SET_CURRENT_PAGE',
        currentPage: page
    }
}