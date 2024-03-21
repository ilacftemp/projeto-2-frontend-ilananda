import React from 'react';
import { Card } from 'antd';
import { Link } from "react-router-dom";
import './index.css';

//  api: https://rapidapi.com/SAdrian/api/moviesdatabase/

const Filme = (props) => {
    const { Meta } = Card;
    console.log(`${JSON.stringify(props.infos)}`)
    let imagem;
    if (props.infos.primaryImage != null){
        imagem = props.infos.primaryImage?.url;
    } else {
        imagem = null;
    }
    const releaseYear = props.infos.releaseYear?.year;
    const titulo = props.infos.titleText?.text;
    const id = props.infos.id;

  return (
    <div className='filme'>
        <Link className='link' to={`pagfilme/${id}`}>
            {imagem ? (
            <img
                className='cover'
                alt="capa do filme"
                src={imagem}
            />
            ) : (
                <p>No Image Available</p>
            )}
        </Link>
        <div>
            <Link className='link' to={`pagfilme/${id}`}>
                <Meta className='title'
                title={titulo}
                description={`Release year: ${releaseYear}`}
                />
            </Link>
        </div>
    </div>
  );
};
export default Filme;
