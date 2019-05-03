import * as React from 'react';
import styled from 'styled-components';
import { MdModeEdit, MdDelete } from 'react-icons/md';
import { AdvertData, StoreState, Dispatch, AuthorData } from '../type';
import { connect } from 'react-redux';
import { setEditorStatus, setItemIndex, setAdverts, setAuthors } from '../actions';


interface OwnProps {
    data: AdvertData;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface SecondPartProps {
    description: string;
}

const Advert = (props: Props) => {
    const [authorName, setAuthorName] = React.useState('');

    const showEditor = () => {
        props.setEditorStatus(true);
    }

    const onDelete = () => {
        const items = [...props.adverts];
        const index = items.findIndex(item => item.authorId === props.data.authorId);
        items.splice(index, 1);

        props.setAdverts(items);
    }

    const onEdit = () => {
        const items = [...props.adverts];
        const index = items.findIndex(item => item.authorId === props.data.authorId);
        props.setItemIndex(index);
        showEditor();
    }

    React.useEffect(() => {
        const author = props.authors.find(item => item.id === props.data.authorId);
        setAuthorName(author ? author.author : '');
    }, [])

    return (
        <AdvertStyled>
            <FirstPart>
                <MainInfo>
                    <Title>{props.data.title}</Title>
                    {authorName !== '' &&
                        <ContentPart>
                            <span>Автор</span>
                            <p>{authorName}</p>
                        </ContentPart>
                    }
                    <ContentPart>
                        <span>Телефон</span>
                        <p>{props.data.phone}</p>
                    </ContentPart>
                    {props.data.city !== '' && 
                        <ContentPart>
                            <span>Город</span>
                            <p>{props.data.city}</p>
                        </ContentPart>
                    }
                </MainInfo>
                <Picture>
                    {props.data.picture !== undefined && props.data.picture !== '' ?
                        <img
                            src={JSON.parse(props.data.picture)}
                        /> :
                        <div>нет изображения</div>
                    }
                </Picture>
            </FirstPart>
            <SecondPart
                description={props.data.description}
            >
                {props.data.description !== '' && 
                    <ContentPart>
                        <span>Описание</span>
                        <p>{props.data.description}</p>
                    </ContentPart>
                }
                <ButtonsArea>
                    <button
                        onClick={onDelete}
                    >
                        <MdDelete />
                    </button>
                    <button
                        onClick={onEdit}
                    >
                        <MdModeEdit />
                    </button>
                </ButtonsArea>
            </SecondPart>
        </AdvertStyled>
    )
}

const mapStateToProps = (store: StoreState) => {
    return {
        adverts: store.adverts,
        authors: store.authors
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setEditorStatus: (status: boolean) => dispatch(setEditorStatus(status)),
        setItemIndex: (index: number | undefined) => dispatch(setItemIndex(index)),
        setAdverts: (items: AdvertData[]) => dispatch(setAdverts(items))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Advert);


/** styling */

const AdvertStyled = styled.div`
    word-wrap: break-word;

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 25em;
    min-height: 20em;
    padding: .5em;
    border-radius: .5em;
    margin-bottom: 2em;
    box-shadow: 0 0 10px 0 gray;
`;

const FirstPart = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 1em;
`;

const MainInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
`;

const SecondPart = styled.div<SecondPartProps>`
    display: flex;
    flex-direction: column;
    justify-content: ${props => props.description === '' ? 'flex-end' : 'space-between'}
    width: 100%;
`;

const Title = styled.h3`
    text-align: center;
    margin: 0 0 .5em 0;
`;

const ContentPart = styled.div`
    display: flex;
    flex-direction: column;

    & > span {
        font-size: .8em;
        padding-bottom: .4em;
        opacity: .7;
    }

    & > p {
        margin: 0 0 1em .5em;
    }
`;

const Picture = styled.div`
    width: 10em;
    height: 10em;

    & > img {
        max-width: 100%;
        max-height: 100%;
        border-radius: .3em;
    }

    & > div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: rgb(220, 220, 220);
        border-radius: .3em;
    }
`;

const ButtonsArea = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 2em;
    margin-top: 1em;

    & > button {
        width: 2em;
        height: 2em;
        padding: .4em;
        border-radius: .2em;
        cursor: pointer;
    }
`;