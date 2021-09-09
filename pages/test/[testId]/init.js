import {useRouter} from "next/router";
import symbols from "../../../public/symbols.json"
import {useState, useRef} from "react";
import React from "react"
import {useTimer} from "react-timer-hook"
import Image from 'next/image'
import testimage from '../../../public/test_image.png'


const init = ({data}) => {

    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault()

        const dev = process.env.NODE_ENV !== 'production';
        const server = dev ? 'http://localhost:8080' : 'https://api.konzentrationstest.ch';

        let response = await fetch(server + `/test/${router.query.testId}/init`, {
            method: "PATCH",
            body: JSON.stringify({
                start_date: new Date()
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.status === 200) {
            window.location.href = `/test/${router.query.testId}`
        } else {
            window.location.href = `/404`
            console.log(response.status)
        }
    }


    return (
        <>
                <div className="bg-gray-100">
                    <div className="min-w-screen min-h-screen mb-5">
                        <div className="flex flex-col items-center justify-center pt-5 mx-5 mb-5 xl:mx-15 xl:my-15">
                            <span
                                className="border border-gray-300 ring-2 ring-red-400 rounded-lg py-3 px-5 text-lg lg:text-xl mb-10">Der Test ist in 2 Abschnitte gegliedert. Im Oberen Teil ist eine Legende zu sehen (je ein Symbol und unten die jeweils dazugehörige Zahl). Im unteren Teil sind 4 Reihen mit je 25 Symbolen und einer Textbox zu sehen. Die Aufgabe ist es, das für das jeweils angegebene Symbol die passende Zahl einzufügen.<br/>
                                    Sobald du auf den Start button drückst, wird dir dein richtiger Test generiert. Ab diesem Moment läuft dein Timer für 2 Minuten. Der Test wird bei Aublauf dieser Zeitspanne automatisch abgesendet.<br/><br/>
                                    kleiner Tipp: Zum nächsten Feld kommst du automatisch, indem du die Tab Taste drückst. (Diese befindet sich links von der Q Taste)<br/><br/>
                                    Regeln: Dein Test wird nicht gewertet, sobald du mehr als 1 Feld hintereinander auslässt. (Es wird die Anzahl an Fehlern gewertet)
                            </span>

                            <Image height="500" width="1000" src={testimage} className="pb-5" placeholder="blur"/>
                            <button type="submit" onClick={(e) => handleSubmit(e)} className="justify-center items-center bg-transparent text-xl hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4
                                        border border-blue-500 hover:border-transparent rounded">
                                starten
                            </button>
                        </div>
                    </div>
                </div>


        </>
    )
}


init.getInitialProps = async ({res, query}) => {

    const dev = process.env.NODE_ENV !== 'production';
    const server = dev ? 'http://localhost:8080' : 'https://api.konzentrationstest.ch';

    let status;
    let data;

    await fetch(server + `/test/${query.testId}`).then(async response => {
        status = response.status;
        await response.json().then(async resData => {
            data = resData

            if (response.status !== 409) {
                if (response.status === 401) {
                    res.writeHead(301, {
                        location: `/test/${query.testId}/sleep`
                    })
                    res.end()
                    //Fragen nicht beantwortet

                } else if (response.status === 404) {
                    res.writeHead(301, {
                        location: `/testNotFound`
                    })
                    res.end()
                    //test exisitert nicht

                } else if (response.status === 402) {
                    res.writeHead(301, {
                        location: `/test/${query.testId}/answers`
                    })
                    res.end()

                } else if (response.status === 403) {
                    res.writeHead(301, {
                        location: `/test/${query.testId}/getting_solved`
                    })
                    res.end()

                }
            }
        })
    })


    if (!data) {
        return {
            notFound: true
        }
    }


    return {data}

}

export default init;