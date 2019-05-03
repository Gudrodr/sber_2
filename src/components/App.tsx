import * as React from 'react';
import styled from 'styled-components';
import List from './List';
import Editor from './Editor';
import { STORAGE_ADVERTS_KEY } from '..';
import { Dispatch, AuthorData } from '../type';
import { connect } from 'react-redux';
import { StoreState } from '../type';
import { getAuthors, setLoading } from '../actions';


type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const App = (props: Props) => {

    React.useEffect(() => {
        fetch('http://localhost:3000/profile/', {method: 'GET'})
            .then(response => response.json())
            .then(data => {
                props.getAuthors(data.authors);
                props.setLoading(false);
            });
    }, []);

    return (
        <Application>
            <List />
            {props.editorStatus &&
                <Editor />
            }
        </Application>
    )
}

const mapStateToProps = (store: StoreState) => {
    return {
        editorStatus: store.editorStatus,
        loading: store.loading
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        getAuthors: (items: AuthorData[]) => dispatch(getAuthors(items)),
        setLoading: (value: boolean) => dispatch(setLoading(value))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);


/** styling */

const Application = styled.div`
    @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900');
    font-family: 'Roboto', sans-serif;

    position: relative;

    min-height: 100vh;
    width: 100vw;
    box-sizing: border-box;

    *, *::before, *::after {
        box-sizing: border-box;
    }
`;