import React, { useEffect } from 'react'
import Lottie from 'lottie-react-web';
//import loadingMorty from '../animaciones/63889-gloot.json';
import secondLoading from '../animaciones/4041-portal-shoot.json';
import '../styles/loadingComponent.css';

export default function LoadingComponent(props) {
    const { setNavigation } = props;

    useEffect(() => {
        if (setNavigation) {
            setTimeout(() => {
                setNavigation("menuPrincipal");
            }, 4000);
        }
    }, [setNavigation]);

    return (
        <div className="containerLoading" >
            <div className="containerAnimation" >
                <Lottie
                    options={{
                        loop: true,
                        autoplay: true,
                        animationData: secondLoading,
                        rendererSettings: {
                            preserveAspectRatio: 'xMidYMid slice'
                        }
                    }}
                    isStopped={false}
                    isPaused={false}
                    height
                    width
                />
                <p style={{ position: 'absolute', bottom: 90 }}>loading ...</p>
            </div>
        </div>
    )
}
