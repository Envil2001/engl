import { useState, useEffect } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { AiOutlineSound } from 'react-icons/ai';
import { RiArrowDownSLine } from 'react-icons/ri';
import { AiOutlineEdit } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const initialValues = {
    wordsEng: '',
    wordRu: '',
    Adjective: '',
    Meaning: '',
    Example: '',
    Synonym: [],
    Audio: '',
    more: false
}

const Home = () => {
    const [wordData, setWordData] = useState(initialValues);
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editableUserData, setEditableUserData] = useState({
        isEdit: false,
        wordIndex: null
    })
    

    const isFieldFields = wordData.wordRu && wordData.wordsEng;

    useEffect(() => {
        const raw = localStorage.getItem('words') || []
        setWords(JSON.parse(raw));
        setLoading(false);
    }, []);

    useEffect(() => {
        localStorage.setItem('words', JSON.stringify(words));
        setLoading(false);
    }, [words])

    const handleSubmitword = (e) => { //Добавление слова
        e.preventDefault();

        if (isFieldFields) {
            if(editableUserData.isEdit) {
                let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordData.wordsEng}`;

                fetch(url)
                    .then(response => response.json())
                    .then(result => {
    
                        if (result.title) {
                            alert(`Can't find the meaning of <span>"${wordData.wordsEng}"</span>. Please, try to search for another word.`);
                        } else {
                            const editedData = words;

                            let adjective = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
                            let definitions = result[0].meanings[0].definitions[0];
                            let example = result[0].meanings[0].definitions[0].example;
                            let Synonyms = definitions.synonyms.filter(word => word.split(" ").length <= 1);
    
                            wordData.Adjective = adjective; // имя прилагательное 
                            wordData.Meaning = definitions.definition; // значения
                            wordData.Example = example; // примеры
                            wordData.Synonym = Synonyms; // синонимы
                            wordData.Audio = "https:" + result[0].phonetics[0].audio; // звук

                            editedData.splice(editableUserData.wordIndex, 1, wordData);
            
                            setWords(editedData);
            
                            setEditableUserData({
                                isEdit: false,
                                wordIndex: null
                            }) 
                            setWordData(initialValues);
                        }
                    }
                    )
                    .catch(() => {
                        alert(`слово ${wordData.wordsEng} было не найдено. Проверьте на корректность слова`);
                    });


            } else {
                let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordData.wordsEng}`;

                fetch(url)
                    .then(response => response.json())
                    .then(result => {
    
                        if (result.title) {
                            alert(`Can't find the meaning of <span>"${wordData.wordsEng}"</span>. Please, try to search for another word.`);
                        } else {
                            let adjective = `${result[0].meanings[0].partOfSpeech}  /${result[0].phonetics[0].text}/`;
                            let definitions = result[0].meanings[0].definitions[0];
                            let example = result[0].meanings[0].definitions[0].example;
                            console.log(definitions.synonyms);
                            let Synonyms = definitions.synonyms.filter(word => word.split(" ").length <= 1);

                            wordData.Adjective = adjective; // имя прилагательное 
                            wordData.Meaning = definitions.definition; // значения
                            wordData.Example = example; // примеры
                            wordData.Synonym = Synonyms; // синонимы
                            wordData.Audio = "https:" + result[0].phonetics[0].audio; // звук
                            
                            setWords((prevState) => [...prevState, wordData]);    
                        }
                        setWordData(initialValues);
                    }
                    )
                    .catch(() => {
                        alert(`слово ${wordData.wordsEng} было не найдено. Проверьте на корректность слова`);
                    });
            }
        } else {
            alert('Заполни поля, идиот')
        }
    }
    const handleAudioClick = (aud) => {
        let plAu = new Audio(aud);
        plAu.play();
    }
    const handleRemoveClick = (index) => { //Удаление слова
        setWords(words.filter((word, indexRemove) => {
            return indexRemove !== index
        }))
    }
    const handleEditClick = (data, index) => { // редактирование слова
        setWordData(data);
        setEditableUserData({
            isEdit: true,
            wordIndex: index
        })
    }
    const handleMarkTodo = (isMarks, index) => { // появление меток
        const updatedWord = words.slice();
        updatedWord.splice(index, 1, { ...words[index], more: !isMarks });
        setWords(updatedWord);
    }
    const handleCleanClick = () => {
        setWordData(initialValues);
        setEditableUserData({
            isEdit: false,
            wordIndex: null
        })
    }; //Очистка инпута


    if (loading) return (
        <div className="centerFixed">
            <div className="contentFix">
                <div className="pswp__preloader__icn">
                    <div className="pswp__preloader__cut">
                        <div className="pswp__preloader__donut"></div>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <>
            <form className="inputContainer" onSubmit={handleSubmitword} onReset={handleCleanClick}>
                <div className="inp">
                    <input type="text" className="inputEng" placeholder="Введите слово на английском" onChange={(e) => setWordData((prevState) => ({
                        ...prevState,
                        wordsEng: e.target.value.replace(/\s+/g, '').replace(/[^\x00-\x7F]/ig, '')
                    }))}
                        value={wordData.wordsEng}
                    ></input>

                    <input type="text" className="inputRu" placeholder="Введите слово на русском" onChange={(e) => setWordData((prevState) => ({
                        ...prevState,
                        wordRu: e.target.value.replace(/\s+/g, '').replace(/^[a-z\s]+$/i, '')
                    }))}
                        value={wordData.wordRu}
                    ></input>
                </div>
                <button type="submit" disabled={!isFieldFields}>{editableUserData.isEdit ? 'Редактировать' : 'Новое слово'}</button>
                <button type="reset" disabled={!isFieldFields}>Очистить</button>
            </form>

            <ul className="ulContainer">
                {
                    words.length >= 1 ?

                        words.map((word, index) => {
                            return (
                                <li key={index} className={word.more ? "itemLi active" : "itemLi"}>
                                    <div className="item_li">
                                        <div className="details">
                                            <Link to={`/word/${word.wordsEng}`} className="engWord">{word.wordsEng} / {word.wordRu}</Link>
                                            <span>{word.Adjective}</span>
                                        </div>
                                        <div className="iconContent">
                                            <RiArrowDownSLine onClick={() => handleMarkTodo(word.more, index)} />
                                            <AiOutlineEdit onClick={() => handleEditClick(word, index)}/>
                                            <AiOutlineSound onDoubleClick={() => {

                                                    let pash = new Audio('https://zvukogram.com/mp3/cats/1200/otdai-salo.mp3');
                                                    pash.play();
                                            }}  onClick={() => handleAudioClick(word.Audio)}/>
                                            <RiDeleteBin6Line onClick={() => handleRemoveClick(index)} />

                                        </div>
                                    </div>
                                    <div className="content_li">
                                        <div className='meaning bl'>
                                            <div className='details'>
                                                <p className="meaningText">Meaning</p>
                                                <span>{word.Meaning}</span>
                                            </div>
                                        </div>
                                        <div className='example bl'>
                                            <div className='details'>
                                                <p className="exampleText">Example</p>
                                                <span>{!word.Example ? "Примеры были не найдены" : word.Example}</span>
                                            </div>
                                        </div>
                                        <div className='synonyms bl'>
                                            <div className='details'>
                                                <p className="synonymsText">Synonyms</p>
                                                <div className='list'>
                                                    {
                                                        word.Synonym.length >= 1 ?
                                                            word.Synonym.map(synonym => {
                                                                return (
                                                                    <p>
                                                                    <span key={synonym} onClick={() => setWordData((prevState) => ({
                                                                        ...prevState,
                                                                        wordsEng: synonym
                                                                    }))}>{synonym}</span>
                                                                    ,
                                                                    </p>
                                                                )
                                                            })
                                                            :
                                                            <span>Синонимы были не найдены</span>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })
                        :
                        <div className='undefined'>
                            Ублюдок не добавил ни одного слова
                        </div>
                }
            </ul>
        </>
    )
}
export default Home;