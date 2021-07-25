import React, { useState, useEffect } from 'react';
import fondoRickMorty from '../images/fondoRickMorty.png';
import axios from 'axios';

import { dataInputs } from '../componets/extras/data';
//styles..
import '../styles/whichCharacter.css';
import '../styles/residenContainer.css'

export default function WhichCharacter(props) {

    const { setNavigation } = props;
    const widthDisplay = window.innerWidth;
    const [startQuiestions, setStartQuiestions] = useState(true);
    const [isPhone, setIsPhone] = useState(false);
    const [isSearchCharacter, setIsSearchCharacter] = useState(false);
    const [character, setCharacter] = useState({});
    const [mensajeError, setMensajeError] = useState("");
    const [dataUser, setDataUser] = useState(null);

    useEffect(() => {
        if (widthDisplay <= 543) {
            setIsPhone(true);
        }
    }, [widthDisplay]);

    const recolectInfo = (e) => setDataUser({ ...dataUser, [e.target.id]: e.target.value });

    const searchCharacterApi = async () => {
        const randonCharacter = Math.floor(Math.random() * (671 - 1)) + 1;
        const uri = `https://rickandmortyapi.com/api/character/${randonCharacter}`;
        const response = await axios.get(uri)
        try {
            setCharacter(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        console.log(dataUser);
    }, [dataUser])

    const logicInputs = async () => {
        if (!dataUser) {
            return setMensajeError("todos los campos son obligatorios");
        }
        if (dataUser.Nombre === "" ||
            dataUser.PaisOrigen === "" ||
            dataUser.Sexo === "" ||
            dataUser.SignoZodical === "") {
           return setMensajeError("todos los campos son obligatorios");
        } 
        await searchCharacterApi();
        setMensajeError("");
        setIsSearchCharacter(true);  
    }

    return (
        <>
            {
                startQuiestions ? (
                    <div
                        style={isPhone ?
                            { width: '100%', height: 200, position: 'relative' }
                            :
                            { width: '100%', height: '100%', position: 'relative' }
                        }
                    >
                        <img src={fondoRickMorty && fondoRickMorty} alt="fondo de rick y morty"
                            style={{ width: '100%', height: '100%' }}
                        />
                        <h1 style={isPhone ? styles.titlePricipalPhone : styles.titlePricipal} >
                            Which rick and morty character are you?
                        </h1>
                        <BotonesComponent
                            stylesComponent={styles.containerButtons}
                            firstOnClick={() => setStartQuiestions(false)}
                            secondOnClick={() => setNavigation("loading")}
                            firstTitle="Go"
                            SecondTitle="back"
                        />
                    </div>
                ) : (
                    <div style={styles.containerCuestionsPrincipal}>
                        <img src={fondoRickMorty && fondoRickMorty} alt="fondo de rick y morty"
                            style={{ width: '100%', height: '100%', position: 'relative' }}
                        />

                        <div className="containerQuestions">
                            {
                                isSearchCharacter ? (
                                    <>
                                        {
                                            character && (
                                                <>
                                                    <div>
                                                        <h3 className="name" > Tu Personaie es: {character.name}</h3>
                                                        <img src={character.image} alt="img_Character"
                                                            style={{ width: 250, height: 300, borderRadius: 10 }}
                                                        />
                                                        <div>
                                                            <p className="textGeneral">Status: {character.status}</p>
                                                            <p className="textGeneral">Specie: {character.species}</p>
                                                            <p className="textGeneral" >Genero: {character.gender}</p>
                                                        </div>
                                                    </div>

                                                    <BotonesComponent
                                                        stylesComponent={styles.containerButtons2}
                                                        firstOnClick={logicInputs}
                                                        secondOnClick={() => {
                                                            setDataUser(null);
                                                            setIsSearchCharacter(false)
                                                        }}
                                                        firstTitle="try again"
                                                        SecondTitle="Back"
                                                    />
                                                </>
                                            )
                                        }
                                    </>
                                ) : (
                                    <>
                                        {
                                            dataInputs.map((data, index) => {
                                                return (
                                                    <input
                                                        key={index}
                                                        type="text"
                                                        placeholder={data.placeholder}
                                                        id={data.id}
                                                        className="inputQuestions"
                                                        onChange={recolectInfo}
                                                    />
                                                )
                                            })
                                        }
                                        <p className="name">{mensajeError}</p>
                                        <BotonesComponent
                                            stylesComponent={styles.containerButtons2}
                                            firstOnClick={logicInputs}
                                            secondOnClick={() => setStartQuiestions(true)}
                                            firstTitle="Search"
                                            SecondTitle="Back"
                                        />
                                    </>
                                )
                            }
                        </div>
                    </div>
                )
            }
        </>
    );
};

function BotonesComponent(props) {
    const { firstOnClick, secondOnClick, firstTitle, SecondTitle, stylesComponent } = props;
    return (
        <div style={stylesComponent} >
            <button className="buttosStyle" onClick={firstOnClick} >
                {firstTitle}
            </button>
            <button className="buttosStyle" onClick={secondOnClick} >
                {SecondTitle}
            </button>
        </div>
    );
};

const styles = {
    titlePricipal: {
        color: 'white',
        fontSize: 100,
        zIndex: 1,
        position: "absolute",
        top: 0,
        left: 10
    },
    titlePricipalPhone: {
        color: 'white',
        fontSize: 25,
        zIndex: 1,
        position: "absolute",
        top: 0,
        left: 10
    },
    containerButtons: {
        width: '100%',
        height: 50,
        position: 'absolute',
        bottom: 150,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 2
    },
    containerButtons2: {
        width: '100%',
        height: 50,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    containerCuestionsPrincipal: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    }
}
