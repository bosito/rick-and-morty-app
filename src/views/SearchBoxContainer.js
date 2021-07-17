import React, { useState, useEffect } from 'react';
import axios from 'axios';

//style
import '../styles/SearchBoxContainer.css';
import '../styles/locationInfo.css';
import '../styles/residenContainer.css';
//images
import icono from '../images/icono.png';
import titleImage from '../images/titleImage.png';

export default function SearchBoxContainer() {

    const [cityName, setCityName] = useState(null);
    const [type, setType] = useState(null);
    const [dimension, setDimension] = useState(null);
    const [residents, setResidents] = useState(null);
    const [inputInfo, setInputInfo] = useState("");
    const [listNameAllDimentoins, setListNameAllDimentoins] = useState(null);
    const [dimentionRandom, setDimentionRandom] = useState(null);
    const [residentList, setResidentList] = useState([]);
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
                setListNameAllDimentoins(response.results)
            });
    }, [])

    useEffect(() => {
        if (dimentionRandom) {
            setResidents(dimentionRandom.residents.length);
            setDimension(dimentionRandom.dimension);
            setType(dimentionRandom.type);
            setCityName(dimentionRandom.name);
        }
    }, [dimentionRandom])

    useEffect(() => {
        if (dimentionRandom) {

            const getIdsCharacter = async () => {
                const idsResidents = await dimentionRandom.residents.map((residentLink) => {
                    const element = residentLink.split("/");
                    return element[element.length - 1]
                });
                residentesApi(idsResidents);
            }

            getIdsCharacter();

        }
    }, [dimentionRandom]);

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

    const residentesApi = async (idsCharacters) => {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/${idsCharacters}`);
        try {
            setResidentList(response.data);
        } catch (error) {
            console.log(error);
        }

    }

    const openClose = (index) => {
        if (currentIndex === index) {
            setcurrentIndex(null);
        } else {
            setcurrentIndex(index);
        }

    }

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
            <div className="residenContainer">

                <div className="containerResidentData">

                    {residentList.length > 0 && (
                        residentList?.map((element, index) => {
                            const { id, name, status, species, type, image, } = element;
                            return (
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
                            )
                        })
                    )}
                </div>

            </div>

        </div>
    );
};

function SearchBox(props) {
    const { inputInfo, setInputInfo, listNameAllDimentoins } = props;

    //validacion del formulario 
    const handelInfoInput = () => {
        const isNameDimention = listNameAllDimentoins.filter((element) => inputInfo === element && element)
        if (isNameDimention.length) {
            console.log('wolas');
        }
    };

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
            <button
                className="button"
                onClick={handelInfoInput}
            >
                SEARCH UBICATIONS
            </button>
        </>
    );

    function SelectComponet({ title, value }) {
        return (
            <select className="amount"
            //onChange={onChange} 
            //value={dadState}
            >
                {/*dataSelect.map((objet, index) => {
                    console.log(objet)
                    return (
                        <option key={index.toString()} value={objet.value}>{objet.name}</option>
                    )
                })*/}
            </select>
        );
    };
};

function ResidentInfo(props) {
    const { index, currentIndex, name, status, type, species, image, onClick, id } = props;
    return (
        <div className={index === currentIndex ? "containerCardResidentAnimation" : "containerCardResident"} key={id.toString()}>
            <div className={index === currentIndex ? "residentInfoImageAnimation" : "residentInfoImage"}>

                <div className="testcontainerInfo" >
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
