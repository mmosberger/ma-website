import {useRouter} from "next/router";
import React, {useEffect, useState} from 'react';


const Sleep = () => {

    const router = useRouter()
    const {testId} = router.query

    let [sleepStart, setStart] = useState("");
    let [sleepEnd, setEnd] = useState("");
    let [drugs, setDrugs] = useState(false);
    let [sleepQuality, setQuality] = useState("1");
    let [sendButtonEnabled, setSendButtonEnable] = useState(false);
    let [showError, setShowError] = useState(false)
    let [errors, setErrors] = useState([])

    useEffect(() => {
        if (!sleepStart) {
            setSendButtonEnable(false)
        } else if (!sleepEnd) {
            setSendButtonEnable(false)
        } else if (drugs === undefined) {
            setSendButtonEnable(false)
        } else if (!sleepQuality) {
            setSendButtonEnable(false)
        } else {
            setSendButtonEnable(true)
        }
    }, [sleepStart, sleepEnd, drugs, sleepQuality])





    const submitAnswers = async (e) => {
        if (!sendButtonEnabled) return;
        setSendButtonEnable(false)

        e.preventDefault()

        let answers = {
            "start_sleep": sleepStart,
            "end_sleep": sleepEnd,
            "drugs": drugs ? "1" : "0",
            "sleep_quality": sleepQuality
        }

        const dev = process.env.NODE_ENV !== 'production';
        const server = dev ? 'http://localhost:8080' : 'https://api.konzentrationstest.ch';


        let response = await fetch(server + `/test/${router.query.testId}/sleep`, {
          method: "PATCH",
            body: JSON.stringify(answers),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            window.location.href = `/test/${testId}/init`
        } else {
            response = await response.json()
            setErrors(response.errors);
            setShowError(true)
        }
    }

    return (
        <form onSubmit={(e) => submitAnswers(e)}>

            <div className="z-40 w-full h-full fixed z-10 top-0 left-0 bg-blue-200 lg:hidden">
                <div className="flex items-center w-full h-full justify-center">
                    <span className="flex align-center">
                        Bitte benutze ein Tablet, damit der Test korrekt auf deinem Ger??t angezeigt wird.
                    </span>
                </div>
            </div>

            <div className="min-h-screen min-w-screen bg-gray-100 flex justify-center items-center w-full h-full">
                <div className="space-y-6 h-full">
                    <h1 className="text-center mt-5 text-4xl font-bold">Fragebogen</h1>
                    {
                        showError ?
                        <ul>
                            {
                                errors.map((error) => (
                                    <li key={error.key++} className="text-red-500">
                                        {error.msg}
                                    </li>
                                ))
                            }
                        </ul> : <></>
                    }


                    <div className="flex items-center p-6 space-x-6 bg-white rounded-xl shadow-lg">
                        <div className="w-1/2 flex py-3 px-4 rounded-lg text-gray-500 font-semibold">
                            <span>Wann bist du schlafen gegangen?</span>
                        </div>
                        <div className="w-1/2">
                            <div className="flex justify-center items-center bg-gray-100 p-4 rounded-lg">
                                <input className="bg-gray-100 rounded-lg outline-none" type="datetime-local"
                                       min="2020-08-20T00:00" max="2022-11-30T00:00"
                                       onChange={(e) => setStart(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center p-6 space-x-6 bg-white rounded-xl shadow-lg">
                        <div className="w-1/2 flex py-3 px-4 rounded-lg text-gray-500 font-semibold">
                            <span>Wann bist du aufgewacht?</span>
                        </div>
                        <div className="w-1/2">
                            <div className="flex justify-center items-center bg-gray-100 p-4 space-x-4 rounded-lg">
                                <input className="bg-gray-100 rounded-lg outline-none" type="datetime-local"
                                       min="2020-08-20T00:00" max="2022-11-30T00:00"
                                       onChange={(e) => setEnd(e.target.value)}/>
                            </div>
                        </div>
                    </div>

                    <div className="flex p-6 space-x-6 bg-white rounded-xl shadow-lg">
                        <div className="w-1/2">
                            <div
                                className="flex justify-center items-center py-3 px-4 rounded-lg text-gray-500 font-semibold">
                                <span>Hast du in den letzten 12 Stunden Alkohol oder Nikotion konsumiert?</span>
                            </div>
                        </div>

                        <div className="w-1/2">
                            <div className="flex justify-center items-center bg-gray-100 p-4 space-x-8 rounded-lg">
                                <label className="justify-center items-center space-x-2">
                                    <input type="radio" className="form-radio" name="drugsbuttons" value="1" checked={drugs}
                                           onChange={(e) => setDrugs(true)}/>
                                    <span>Ja</span>
                                </label>
                                <label className="justify-center items-center space-x-2">
                                    <input type="radio" className="form-radio" name="drugsbuttons" value="0" checked={!drugs}
                                           onChange={(e) => setDrugs(false)}/>
                                    <span>Nein</span>
                                </label>
                            </div>
                        </div>
                    </div>


                    <div className="flex items-center justify-center p-6 space-x-6 bg-white rounded-xl shadow-lg">
                        <div className="w-1/2">
                            <div className="py-3 px-4 rounded-lg text-gray-500 font-semibold">
                                <span>Wie gut hast du geschlafen?<br/>(1 = sehr schlecht, 10 = sehr gut) </span>
                            </div>
                        </div>
                        <div className="w-1/2">
                            <div className="flex justify-center items-center bg-gray-100 p-4 space-x-8 rounded-lg">
                                <label className="inline-flex space-x-2 items-center rounded-lg">
                                    <select className="rounded-lg" onChange={(e) => setQuality(e.target.value)}>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </select>
                                </label>
                            </div>
                        </div>

                    </div>
                    <div className="flex justify-center items-center py-2 px-4">
                        <button type="submit" disabled={!sendButtonEnabled}
                                className="bg-blue-700 hover:bg-blue-800 px-5 py-3 rounded-lg text-white text-xl duration-500">
                            absenden
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}


Sleep.getInitialProps = async ({res, query}) => {

    const dev = process.env.NODE_ENV !== 'production';
    const server = dev ? 'http://localhost:8080' : 'https://api.konzentrationstest.ch';

    let status;
    let data;


    await fetch(server + `/test/${query.testId}`).then(async response => {
        status = response.status;
        await response.json().then(async resData => {
            data = resData

            if (response.status !== 200) {
                if (response.status === 404) {
                    res.writeHead(301, {
                        location: `/testNotFound`
                    })
                    res.end()
                    //test nicht gefunden

                } else if (response.status === 403) {
                    //test wird zurzeit gel??st
                    res.writeHead(301, {
                        location: `/test/${query.testId}/getting_solved`
                    })
                    res.end()
                } else if (response.status === 402) {
                    res.writeHead(301, {
                        location: `/test/${query.testId}/answers`
                    })
                    res.end()
                } else if (response.status === 409) {
                    // Fragen beantwortet, test noch nicht gestartet
                    res.writeHead(301, {
                        location: `/test/${query.testId}/init`
                    })
                    res.end()
                }
            } else {
                res.writeHead(301, {
                    location: `/test/${query.testId}`
                })
                res.end()
            }
        })
    })

    return {data}

}


export default Sleep;
