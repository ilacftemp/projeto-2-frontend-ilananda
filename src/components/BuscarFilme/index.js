import React, {useState} from 'react';
import './index.css';
import axios from 'axios';
import Filme from '../Filme';

export default function BuscarFilme(props){
    const [titulo, setTitulo] = useState("");
    const [resultados, setResultados] = useState([]);
    const [existe, setExiste] = useState(true);

    const options = {
        params: {
          exact: `false`,
          titleType: 'movie'
        },
        headers: {
          'X-RapidAPI-Key': 'fcc2c4246fmsh02ccffd5e5d1651p1397fbjsndef4f61b2e54',
          'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
        }
  };

    async function getFilme(titulo, options){
        const response = await axios.get(`https://moviesdatabase.p.rapidapi.com/titles/search/title/${titulo}`, options);
        console.log(response.data.results)
        if(response.data.results.length != 0){
            setResultados(response.data.results);
            setExiste(true);
        } else {
            setExiste(false);
            console.log("nao tem")
        }
    };

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            afterSubmit(event);
        }
    }

    const afterSubmit = (event) => {
        setTitulo(event.target.value);
        console.log(titulo)
        const tituloTratado = encodeURIComponent(titulo);
        getFilme(tituloTratado, options);
    }
    
    return (
        <div className='app'>
            <div className='header'>
                <div className='search-bar'>
                    <input
                        type="text"
                        placeholder="Search a movie"
                        onChange={(event) => {setTitulo(event.target.value)}}
                        value={titulo}
                        className='search-input'
                        onKeyDown={handleKeyPress}
                    />
                </div>
            </div>
            <div className='content-section'>
                <div className='apps-card'>
                    <div className='carrosel'>
                        {existe && (
                            resultados.map((filme) => (
                                <li className='movies' key={filme.id}>
                                    {console.log(`filmeid ${filme.id}`)}
                                    {console.log(`filme ${JSON.stringify(filme, null, 2)}`)}
                                    <Filme infos={filme}></Filme>
                                </li>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
