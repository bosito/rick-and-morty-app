import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';

//style
import '../styles/SearchBoxContainer.css';
import '../styles/locationInfo.css';
import '../styles/residenContainer.css';
import '../styles/naveRick.css';
import { motion } from "framer-motion";
//images
import icono from '../images/icono.png';
import titleImage from '../images/titleImage.png';
import naveRick from '../images/naveRick.png';

export default function SearchBoxContainer(props) {

    const { setNavigation } = props;
    const widthDisplay = window.innerWidth;
    const [cityName, setCityName] = useState(null);
    const [type, setType] = useState(null);
    const [dimension, setDimension] = useState(null);
    const [residents, setResidents] = useState(null);
    const [inputInfo, setInputInfo] = useState("");
    const [listNameAllDimentoins, setListNameAllDimentoins] = useState(null);
    const [dimentionRandom, setDimentionRandom] = useState(null);
    const [residentList, setResidentList] = useState(null);
    const [currentIndex, setcurrentIndex] = useState(null);

    useEffect(() => {
        //el 108 es el total de dimenciones que hay.
        const numberRandom = Math.floor(Math.random() * 108).toString();
        peticionApi('location', numberRandom)
            .then((response) => {
                setDimentionRandom(response)
            }); // episode .... character;
    }, []);

    useEffect(() => {
        peticionApi('location')
            .then((response) => {
                const filterNames = getNameAllDimentions(response.results);
                setListNameAllDimentoins(filterNames);
            });
    }, []);

    useEffect(() => {
        if (dimentionRandom) {
            setResidents(dimentionRandom.residents.length);
            setDimension(dimentionRandom.dimension);
            setType(dimentionRandom.type);
            setCityName(dimentionRandom.name);
        }
    }, [dimentionRandom]);

    useEffect(() => {
        if (dimentionRandom) {

            const getIdsCharacterInicial = async (arrayDimentio) => {
                const idsResidents = await arrayDimentio.residents.map((residentLink) => {
                    const element = residentLink.split("/");
                    return element[element.length - 1]
                });
                residentesApi(idsResidents);
            };

            getIdsCharacterInicial(dimentionRandom);
        }
    }, [dimentionRandom]);

    const getNameAllDimentions = (data) => {
        const listData = [...data]

        const filterNames = [];
        for (let index = 0; index < listData.length; index++) {
            filterNames.push(listData[index].name)
        }

        return filterNames;
    };

    const getIdsCharacter = async (arrayDimentio) => {
        const idsResidents = await arrayDimentio.residents.map((residentLink) => {
            const element = residentLink.split("/");
            return element[element.length - 1]
        });
        residentesApi(idsResidents);
    };

    const peticionApi = async (url, idUrl) => {
        let newUrl;
        if (url && idUrl) {
            newUrl = `https://rickandmortyapi.com/api/${url}/${idUrl}`
        } else {
            newUrl = `https://rickandmortyapi.com/api/${url}`
        }
        const response = await axios.get(newUrl);
        try {
            return response.data
        } catch (error) {
            console.log(error, 'parece que hay un error');
        };
    };

    const newLocatization = async (nameDimension) => {
        const response = await axios.get(`https://rickandmortyapi.com/api/location/?name=${nameDimension.toString()}`);
        try {
            return response.data
        } catch (error) {
            console.log(error);
        }
    };

    const residentesApi = async (idsCharacters) => {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${idsCharacters}`);
        try {
            setResidentList(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const openClose = (index) => {
        if (currentIndex === index) {
            setcurrentIndex(null);
        } else {
            setcurrentIndex(index);
        }

    };

    const handelInfoInput = () => {
        const isNameDimention = listNameAllDimentoins.filter((element) => inputInfo === element && element)
        //Earth (C-137)
        //Citadel of Ricks
        if (isNameDimention.length) {
            newLocatization(inputInfo)
                .then((res) => {
                    const respuesta = res.results[0];
                    setDimension(respuesta.dimension);
                    setResidents(respuesta.residents.length);
                    setType(respuesta.type);
                    setCityName(respuesta.name);
                    getIdsCharacter(respuesta);
                    setcurrentIndex(null);
                })
                .catch((err) => console.log(err))
        } else {

        }
    };

    return (
        <div style={{ flex: 1 }}>
            <div className="searchBoxContainer" >
                <div className="containerLeft" >
                    <img src={titleImage && titleImage} className="titleImage" alt="Rick and Morty" />
                    <div className="containerMenssage">
                        <h2 style={{ textAlign: 'center' }}>Datos y curiosidades sobre los personajes de rick and morty</h2>
                    </div>
                </div>
                <div className="containerRight" >
                    <SearchBox
                        inputInfo={inputInfo}
                        setInputInfo={setInputInfo}
                        handelInfoInput={handelInfoInput}
                        listNameAllDimentoins={listNameAllDimentoins}
                    />
                </div>
                <LocationInfo
                    type={type}
                    cityName={cityName}
                    dimension={dimension}
                    residents={residents}
                />
            </div>
            {residentList && (
                <div className="residenContainer">
                    <div className="containerResidentData">

                        {residentList.length > 0 && (
                            residentList?.map((element, index) => {
                                const { id, name, status, species, type, image, } = element;
                                return (
                                    <Fragment key={index.toString()}>
                                        <ResidentInfo
                                            id={id}
                                            index={index}
                                            currentIndex={currentIndex}
                                            name={name}
                                            status={status}
                                            type={type ? type : "unknown"}
                                            species={species}
                                            image={image}
                                            onClick={() => openClose(index)}
                                        />
                                    </Fragment>
                                )
                            })
                        )}

                    </div>
                </div>
            )}

            <motion.img
                src={naveRick && naveRick}
                onClick={()=>setNavigation("menuPrincipal")}
                className="naveRick click"
                animate={{
                    translateX: widthDisplay - 80,
                    display: ["flex", "none"]
                }}
                transition={{
                    duration: 5,
                    delay: 5,
                    ease: "linear"
                }}
            />

        </div>
    );
};

function SearchBox(props) {
    const { inputInfo, setInputInfo, handelInfoInput, listNameAllDimentoins } = props;

    return (
        <>
            <img src={icono && icono}
                className="titleImage iconImage"
                style={{ marginBottom: 10 }}
                alt="icono rick and morty"
            />
            <input type="text"
                className="containerMenssage inputStyle"
                placeholder="looking for location"
                value={inputInfo}
                onChange={(e) => setInputInfo(e.target.value)}
            />
            <SelectComponet
                setInputInfo={setInputInfo}
                inputInfo={inputInfo}
            />
            <button
                className="button"
                onClick={handelInfoInput}
            >
                SEARCH UBICATIONS
            </button>
        </>
    );

    function SelectComponet({ setInputInfo, inputInfo }) {
        return (
            <select className="amount"
                onChange={(e) => setInputInfo(e.target.value)}
                value={inputInfo}
            >
                {listNameAllDimentoins && (
                    listNameAllDimentoins.map((objet, index) => {
                        return (
                            <option key={index.toString()} value={objet}>{objet}</option>
                        )
                    })
                )}
            </select>
        );
    };
};

function ResidentInfo(props) {
    const { index, currentIndex, name, status, type, species, image, onClick, id } = props;
    return (
        <div className={index === currentIndex ? "containerCardResidentAnimation" : "containerCardResident"} key={id.toString()}>
            <div className={index === currentIndex ? "residentInfoImageAnimation" : "residentInfoImage"}>

                <div className={index === currentIndex ? "testcontainerInfoAnimation" : "testcontainerInfo"} >
                    <p className="name">{name}</p>
                    <p className="textGeneral">status: {status}</p>
                    <p className="textGeneral">type: {type}</p>
                    <p className="textGeneral">specie: {species}</p>
                </div>

                <div className="residenData" onClick={onClick}>
                    <img src={image} alt={index.toString()} style={{ flex: 1 }} className="imagePersonage" />
                    {
                        index === currentIndex || <h1 className="nameCharacter">{name}</h1>
                    }
                </div>

            </div>
        </div>
    );
};

function LocationInfo({ type, cityName, dimension, residents }) {
    return (
        <div className="locationInfo">
            <p>CITY NAME : {cityName}</p>
            <p>TYPE : {type}</p>
            <p>DIMENSION : {dimension}</p>
            <p>RESIDENTS NUMBER: {residents}</p>
        </div>
    );
};
