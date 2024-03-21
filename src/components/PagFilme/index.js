import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './index.css';

export default function PagFilme(props){
    const [palavras, setPalavras] = useState([]);
    const [infos1, setInfos1] = useState([]);
    const [rating, setRating] = useState([]);
    const [add, setAdd] = useState(false);

    const location = useLocation();
    const id = location.pathname.split("/").pop()

    const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'fcc2c4246fmsh02ccffd5e5d1651p1397fbjsndef4f61b2e54',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
    };

    const [response, setResponse] = useState(null);
    let imagem;
    if (infos1.results?.primaryImage!= null){
        imagem = infos1.results?.primaryImage.url;
    } else {
        imagem = null;
    }
    const releaseYear = infos1.results?.releaseYear.year;
    let titulo = infos1.results?.titleText.text;

    useEffect(() => {
        {response == null ? (
            axios.get(`https://moviesdatabase.p.rapidapi.com/titles/${id}`, options)
            .then((resp_infos1) => {
            setInfos1(resp_infos1.data);
        })
        ) : (
            setResponse(null)
        )};
        axios.get(`https://moviesdatabase.p.rapidapi.com/titles/${id}/ratings`, options)
        .then((resp_infos2) => {
            setRating(resp_infos2.data.results?.averageRating);
        });
    }, []);

    useEffect(() => {
        if (infos1.results?.titleText.text) {
            axios.get(`http://localhost:8000/api/filmes/${infos1.results.titleText.text}/`)
            .then((str_response) => {
                const str_palavras = str_response.data.palavras;
                if (str_palavras != '' && str_palavras != undefined){
                    setPalavras(str_palavras.trim().split(','));
                } else {
                    setPalavras([]);
                }
            })
            .catch(error => {
                console.error('Error in Axios request:', error);
            });
        }
    }, [infos1]);

    const addWord = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const palavra = formData.get('palavra-chave');


        const atualizar_palavras = palavras;
        atualizar_palavras.push(palavra);
        setPalavras(atualizar_palavras);
        axios.post(`http://localhost:8000/api/filmes/${titulo}/`, palavra, {headers:{"Content-Type" : "application/json"}});

        setAdd(false);
    };

    function delete_word(palavra) {
        axios.delete(`http://localhost:8000/api/filmes/${titulo}/${palavra}`)
        .then(response => {
            if (response.data && response.data.reload) {
                window.location.reload();
            }
        })
    };

    return(
        <div className='app'>
            <div className='header'>
                <h1 className='text-filme'>{titulo} ({releaseYear})</h1>
            </div>
            <div className='content-section'>
                <div className='apps-card'>
                    <div className='carroselPagFilme'>
                        <div className='pag-filme'>
                            <h2>Avaliação: {rating}</h2>
                            <img className='cover' src={imagem}></img>
                        </div>
                        <div className='card-filme'>
                            <div className='text-filme'>
                                <h2 className='text-filme'>Palavras-chave relacionadas ao filme escolhido:</h2>
                                {palavras.length === 0 ? (
                                    <p>Ainda não há palavras chaves atreladas ao filme.</p>
                                ) : (
                                    <ul> {palavras.map((palavra, index)=>(
                                        <li className="palavraMaisDeletar" key={index}>
                                            <p className='palavra'>{palavra}</p>
                                            <button className='bin' onClick={() => delete_word(palavra)}>
                                                <img className="binImage" src='/bin.png' />
                                            </button>
                                        </li>
                                    ))}
                                    </ul>
                                )}
                                {add ? (
                                    <form method="POST" id="adicionar" onSubmit={addWord}>
                                        <div className='word-bar'>
                                            <input name="palavra-chave" className="word-input" type="text" placeholder='Adicione uma palavra-chave'/>
                                            <input name="submit" type='submit' hidden />
                                        </div>
                                    </form>
                                ) : (
                                    <button className='add' onClick={() => {setAdd(true)}}>
                                            <img src='/add.png' />
                                    </button>
                                )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};