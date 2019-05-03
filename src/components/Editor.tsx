import * as React from 'react';
import styled from 'styled-components';
import { cityList } from '../citylist';
import { MdClose } from 'react-icons/md';
import { AdvertData, Dispatch, StoreState, AuthorData } from '../type';
import { PHONE_REGEXP } from '..';
import { connect } from 'react-redux';
import { setEditorStatus, setAdverts, setAuthors, setLastId, setCurrentPage } from '../actions';


type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface RowProps {
    invalid?: boolean;
    checked?: boolean;
}

const defaultData = {
    authorId: undefined,
    title: '',
    description: '',
    phone: '',
    city: 'Москва',
    picture: ''
}

const Editor = (props: Props) => {
    const data = props.itemIndex === undefined ? defaultData : props.adverts[props.itemIndex];

    const [title, setTitle] = React.useState(data.title);
    const [authorId, setAuthorId] = React.useState(data.authorId);
    const [authorName, setAuthorName] = React.useState('');
    const [description, setDescription] = React.useState(data.description);
    const [phone, setPhone] = React.useState(data.phone);
    const [city, setCity] = React.useState(data.city);
    const [picture, setPicture] = React.useState(data.picture);
    const [validity, setValidity] = React.useState({title: false, phone: false, checked: false});

    const checkFields = (e: React.FormEvent) => {
        e.preventDefault();

        const validPhone = phone.match(PHONE_REGEXP);
        const validTitle = title !== '';

        setValidity({title: validTitle, phone: !!validPhone, checked: true});
    };

    const loadFile = (e) => {
        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                const dataurl = JSON.stringify(reader.result);
                setPicture(dataurl);
            }
            reader.readAsDataURL(e.target.files[0]);
        } catch (err) {
            console.error(err);
        }
    }

    const hideEditor = () => {
        props.setEditorStatus(false);
    }

    React.useEffect(() => {
        fetch('http://localhost:3000/profile/', {method: 'GET'})
            .then(response => response.json())
            .then(result => props.setLastId(result.lastId));
        if (authorId !== undefined) {
            const author = props.authors.find(item => item.id === authorId)
            setAuthorName(author ? author.author : '');
        }
    }, [])
    
    React.useEffect(() => {
        if (!validity.title || !validity.phone) return;

        let currentPage = props.currentPage;
        const localAdvertsData: AdvertData[] = [...props.adverts];
        const localAuthorsData: AuthorData[] = [...props.authors];
        const newAuthorData: AuthorData = {
            id: authorId || props.lastId,
            author: authorName
        };
        const newAdvertData: AdvertData = {
            authorId: newAuthorData.id,
            title,
            phone,
            city,
            description,
            picture
        };

        if (props.itemIndex !== undefined) {
            localAdvertsData[props.itemIndex] = newAdvertData;
            const index = localAuthorsData.findIndex(item => item.id === authorId);
            localAuthorsData[index] = newAuthorData;
        } else {
            currentPage = Math.ceil(localAdvertsData.length / 5) - 1;
            localAdvertsData.push(newAdvertData);
            localAuthorsData.push(newAuthorData);
        }

        const newLastId = authorId !== undefined ? authorId : props.lastId;

        props.setAdverts(localAdvertsData);
        props.setCurrentPage(currentPage);
        props.setAuthors(localAuthorsData, newLastId + 1);
        hideEditor();
        
    }, [validity])

    return (
        <SubLayer
            onClick={hideEditor}
        >
            <EditorStyled
                onSubmit={e => checkFields(e)}
                onClick={e => e.stopPropagation()}
            >
                <Close 
                    onClick={hideEditor}
                >
                    <MdClose />
                </Close>
                <Row invalid={!validity.title} checked={validity.checked}>
                    <label>Название</label>
                    <input
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder='100 символов'
                        maxLength={100}
                        required
                    />
                </Row>
                <Row>
                    <label>Описание</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder='300 символов'
                        maxLength={300}
                        rows={5}
                    />
                </Row>
                <Row>
                    <label>Автор</label>
                    <input
                        value={authorName}
                        onChange={e => setAuthorName(e.target.value)}
                        placeholder='Как к Вам обращаться'
                    />
                </Row>
                <Row invalid={!validity.phone} checked={validity.checked}>
                    <label>Номер телефона</label>
                    <input
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder='+7 999 999 99 99'
                        required
                    />
                </Row>
                <Row>
                    <label>Город</label>
                    <Select
                        defaultValue={city}
                        onChange={e => setCity(e.target.value)}
                    >
                        {[...cityList].sort().map(item => 
                            <option key={item}>{item}</option>
                        )}
                    </Select>
                </Row>
                <Row>
                    {picture !== undefined && picture !== '' ?
                        <Picture>
                            <PictureRemove
                                onClick={() => setPicture('')}
                            />
                            <img
                                src={JSON.parse(picture)}
                            />
                        </Picture> :
                        <>
                            <label>Изображение</label>
                            <FileInput 
                                type='file'
                                onChange={e => loadFile(e)}
                            />
                        </>
                    }
                </Row>
                <Button
                    type='submit'
                >
                    {props.itemIndex !== undefined ? 'Сохранить' : 'Создать'}
                </Button>
            </EditorStyled>
        </SubLayer>
    )
}

const mapStateToProps = (store: StoreState) => {
    return {
        adverts: store.adverts,
        authors: store.authors,
        itemIndex: store.itemIndex,
        lastId: store.lastId,
        currentPage: store.currentPage
    }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setEditorStatus: (status: boolean) => dispatch(setEditorStatus(status)),
        setAdverts: (items: AdvertData[]) => dispatch(setAdverts(items)),
        setAuthors: (items: AuthorData[], lastId: number) => dispatch(setAuthors(items, lastId)),
        setLastId: (id: number) => dispatch(setLastId(id)),
        setCurrentPage: (page: number) => dispatch(setCurrentPage(page))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);


/** styling */

const SubLayer = styled.div`
    position: fixed;
    top: 0;

    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-color: rgba(240, 240, 240, .7);
`;

const EditorStyled = styled.form`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40em;
    padding: 2em;
    border-radius: .5em;
    box-shadow: 0 0 10px 0 gray;

    background-color: white;
`;

const Close = styled.span`
    position: absolute;
    right: 1em;
    top: 1em;

    display: flex;
    justify-content: center;
    align-items: center;
    width: 1em;
    height: 1em;
    cursor: pointer;
`;

const Row = styled.div<RowProps>`
    display: flex;
    flex-direction: column;
    width: 100%;

    & > input, textarea, select {
        padding: .5em 0 .5em 0;
        background-color: white;
        border: none;
        border-bottom: ${props => props.checked && props.invalid ? '1px solid red' : '1px solid lightgray'};
        margin: .5em 0 1.5em 0;

        ::placeholder {
            font-size: .8rem;
            opacity: .8;
        }
    }
`;

const Select = styled.select`
    cursor: pointer;
`;

const FileInput = styled.input`
    cursor: pointer;
`;

const Picture = styled.div`
    position: relative;
    width: 10em;
    height: 10em;

    & > img {
        max-width: 100%;
        max-height: 100%;
        border-radius: .3em;
    }
`;

const PictureRemove = styled(MdClose)`
    position: absolute;
    top: .2em;
    right: .2em;
    cursor: pointer;
`;

const Button = styled.button`
    width: 10em;
    border-radius: .3em;
    cursor: pointer;
`;