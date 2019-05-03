import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'normalize.css';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { StoreState } from './type';
import App from './components/App';
import Action from './actions';

export const STORAGE_ADVERTS_KEY = 'adverts';
export const PHONE_REGEXP = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/gm;


const initialState: StoreState = {
    adverts: JSON.parse(localStorage.getItem(STORAGE_ADVERTS_KEY) || '[]'),
    authors: [],
    editorStatus: false,
    itemIndex: undefined,
    lastId: 0,
    loading: true,
    currentPage: 0
};

const middleware = ({getState}) => {
    return next => (action: Action) => {
        if (action.type === 'SET_ADVERTS') {
            if (action.adverts) {
                localStorage.setItem(STORAGE_ADVERTS_KEY, JSON.stringify(action.adverts))
            }
        }
        if (action.type === 'SET_AUTHORS') {
            if (action.id && action.authors) {
                fetch(`http://localhost:3000/profile/`, {
                    method: 'POST', 
                    headers: {'Content-Type': 'application/json'}, 
                    body: JSON.stringify({authors: action.authors, lastId: action.id})
                });
            }
        }
        return next(action);
    }
}


const userAction = (state = initialState, action: Action) => {
    if (action.type === 'SET_EDITOR_STATUS') {
        return {...state, editorStatus: action.editorStatus};
    }
    if (action.type === 'SET_ITEM_INDEX') {
        return {...state, itemIndex: action.itemIndex}
    }
    if (action.type === 'SET_ADVERTS') {
        return {...state, adverts: action.adverts}
    }
    if (action.type === 'SET_AUTHORS') {
        return {...state, authors: action.authors}
    }
    if (action.type === 'GET_AUTHORS') {
        return {...state, authors: action.authors}
    }
    if (action.type === 'SET_LOADING') {
        return {...state, loading: action.loading}
    }
    if (action.type === 'SET_LAST_ID') {
        return {...state, lastId: action.lastId}
    }
    if (action.type === 'SET_CURRENT_PAGE') {
        return {...state, currentPage: action.currentPage}
    }
    return state;
};

const store = createStore(userAction, initialState, applyMiddleware(middleware));

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('container'));