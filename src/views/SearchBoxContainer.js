import React, { useState, useEffect } from 'react';
import axios from 'axios';

//style
import '../styles/SearchBoxContainer.css';
import '../styles/locationInfo.css'
//images
import icono from '../images/icono.png';
import titleImage from '../images/titleImage.png';

export default function SearchBoxContainer() {
    const [cityName, setCityName] = useState(null);
    const [type, setType] = useState(null);
    const [dimension, setDimension] = useState(null);
    const [residents, setResidents] = useState(null);
    const [inputInfo, setInputInfo] = useState("");
    const [data, setData] = useState([]);
    const [arrayNamesDimentions, setArrayNamesDimentions] = useState([]);
    const [dimentionRandom, setDimentionRandom] = useState(null);
    const [residentList, setResidentList] = useState(null);

    useEffect(() => {
        peticionApi('location')
            .then((response) => {
                setDimentionRandom(response[Math.floor(Math.random() * response.length)])
                setData(response)
            }) // episode .... character
    }, []);

    // useEffect(() => {
    //     console.log(dimentionRandom);
    // }, [dimentionRandom])

    useEffect(() => {
        if (dimentionRandom) {
            setResidentList(dimentionRandom.residents)
            setResidents(dimentionRandom.residents.length);
            setDimension(dimentionRandom.dimension);
            setType(dimentionRandom.type);
            setCityName(dimentionRandom.name);
        }
    }, [dimentionRandom])

    useEffect(() => {
        if (data) {
            const arrayFilter = [];
            data.map((element) => {
                if (element.name) {
                  return arrayFilter.push(element.name);
                }
            });
            setArrayNamesDimentions(arrayFilter);
        }
    }, [data])

    const peticionApi = async (url) => {
        const response = await axios.get(`https://rickandmortyapi.com/api/${url}`);
        try {
            return response.data.results
        } catch (error) {
            console.log(error, 'parece que hay un error');
        };
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
                        arrayNamesDimentions={arrayNamesDimentions}
                    />
                </div>
                <LocationInfo
                    type={type}
                    cityName={cityName}
                    dimension={dimension}
                    residents={residents}
                />
            </div>

        </div>
    );
};

function SearchBox(props) {
    const { inputInfo, setInputInfo, arrayNamesDimentions } = props;

    const handelInfoInput = () => {
        const isNameDimention = arrayNamesDimentions.filter((element) => inputInfo === element && element)
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
                    return (
                        <option key={index.toString()} value={objet.value}>{objet.name}</option>
                    )
                })*/}
            </select>
        );
    };
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
