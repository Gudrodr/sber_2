import * as React from 'react';
import styled from 'styled-components';
import Advert from './Advert';
import { MdAdd } from 'react-icons/md';
import { AdvertData, StoreState, Dispatch } from '../type';
import { connect } from 'react-redux';
import { setEditorStatus, setItemIndex, setCurrentPage } from '../actions';
import { BeatLoader } from 'react-spinners';


interface PagingItemProps {
    selected: boolean;
}

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const List = (props: Props) => {
    const [displaying, setDisplaying] = React.useState(props.adverts);
    const [pagination, setPagination] = React.useState<number[]>([]);

    React.useEffect(() => {
        const paging: number[] = [];

        for (let i = 0; i < Math.ceil(props.adverts.length / 5); i++) paging.push(i);
        
        setPagination(paging);
        setDisplaying(props.adverts.slice(props.currentPage * 5, (props.currentPage + 1) * 5));
    }, [props.adverts, props.currentPage])

    const onPageChange = (pageNumber: number) => {
        props.setCurrentPage(pageNumber);
    }

    const showEditor = () => {
        props.setItemIndex(undefined);
        props.setEditorStatus(true);
    }

    return (
        <ListStyled>
            {props.loading ?
                <Spinner><BeatLoader /></Spinner> :
                displaying.map(advert =>
                    <Advert
                        key={advert.authorId}
                        data={advert}
                    />
                )
            }
            <AddItem>
                <Round
                    onClick={showEditor}
                >
                    <MdAdd
                        color='white'
                        size='6em'
                    />
                </Round>
                <Pagination>
                    {pagination.length > 1 && pagination.map((item, index) => 
                        <PagingItem
                            key={index}
                            selected={item === props.currentPage}
                            onClick={() => onPageChange(item)}
                        >
                            {item + 1}
                        </PagingItem>    
                    )}
                </Pagination>
            </AddItem>
        </ListStyled>
    )
}

const mapStateToProps = (store: StoreState) => {
    return {
        adverts: store.adverts,
        loading: store.loading,
        currentPage: store.currentPage
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setItemIndex: (index: number | undefined) => dispatch(setItemIndex(index)),
        setEditorStatus: (status: boolean) => dispatch(setEditorStatus(status)),
        setCurrentPage: (page: number) => dispatch(setCurrentPage(page))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(List);


/** styling */

const ListStyled = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    width: 100%;
    padding: 2.5em;
`;

const Spinner = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25em;
    min-height: 20em;
`;

const AddItem = styled.div`
    position: relative;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 25em;
    height: 20em;
`;

const Round = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10em;
    height: 10em;
    background-color: gray;
    border-radius: 5em;
    cursor: pointer;
`;

const Pagination = styled.div`
    position: absolute;
    bottom: 0;

    display: flex;
    justify-content: center;
    width: 100%;
    height: 2em;
`;

const PagingItem = styled.span<PagingItemProps>`
    padding: .5em;
    background-color: ${props => props.selected ? 'lightgray' : 'transparent'}
    border: 1px solid gray;
    border-radius: .2em;
    margin-left: .3em;
    cursor: pointer;

    :first-child {
        margin-left: 0;
    }
`;