import React from 'react'
import { MdArrowBack } from 'react-icons/md';
import { BsFillBookmarksFill } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';

const WordPage = () => {
    const history = useNavigate();
    const { word } = useParams();
    return (
        <>
        <div className='header-w'>
            <button><MdArrowBack onClick={() => history(-1)}/></button>
            <button><BsFillBookmarksFill /></button>
        </div>
        <div className='BoxWord'>
            <h5 className="BoxWord__title">{word}</h5>
            <button className='BoxWord__playaudio'></button>
        </div>

        </>
    )
}

export default WordPage;
