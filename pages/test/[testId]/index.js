import {useRouter} from "next/router";
import symbols from "../../../public/symbols.json"
import {useEffect, useState, useRef} from "react";
import React from "react"
import {useTimer} from "react-timer-hook"

const Test = ({data}) => {
    const answersRef = useRef();
    const router = useRouter();
    const submitButtonRef = useRef();

    const handleSubmit = async (event) => {

    }

    //TODO API Request, Blur wenn Timer noch nicht gestartet, Timer wird noch nciht unten dargestellt, errors zeigen (sollte keine geben), automatisches senden (Vorteile wenn nicht, die Zahlen können nur gesendet werden, wenn sie im min/max Bereich drin sind
    const patchApi = async (patchData) => {
        let status;

        await fetch(`http://localhost:${process.env.APIPORT}/test/${router.query.testId}`, {
            method: "PATCH",
            body: json.stringify(patchData),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async response => {
            status = response.status;
            await response.json().then(async resData => {

                if (response.status !== 200) {
                    console.log(response.errors[0].msg)
                }
            })
        })
    }

    let expiryTimestamp = +new Date() + 90
    const {
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({expiryTimestamp, onExpire: () => console.warn('onExpire called')});


    return (
        <>


            <div className="z-40 w-full h-full fixed z-10 top-0 left-0 bg-blue-200 lg:hidden">
                <div className="flex items-center w-full h-full justify-center">
                    <span className="f align-center">
                        Bitte benutze ein Tablet, damit der Test korrekt auf deinem Gerät angezeigt wird.
                    </span>
                </div>
            </div>
            <div>
                <button onClick={start}>Start</button>
                <form name="testform" onSubmit={(event => handleSubmit(event))}>
                    <div className="bg-gray-100 min-w-screen min-h-screen">
                        <div className="flex p-10 w-full">
                            <div className="flex flex-wrap w-full items-center justify-center">
                                {
                                    data.legende.map(number => (

                                        <div className="border border-black justify-center w-12" key={number.icon_no}>
                                            <p className="bg-gray-200 text-center text-2xl border border-rounded-none">{symbols.find(x => x.id === number.icon_id).symbol}</p>
                                            <p className="text-center text-2xl border border-rounded-none">{number.icon_no}</p>
                                        </div>

                                    ))
                                }
                            </div>
                        </div>

                        <div className="mt-10 mx-8">
                            <div className="mt-10 flex justify-center">
                                <div className="flex flex-wrap max-w-7xl ">
                                    {
                                        data.answers.map(answer => (

                                            <div className="w-1/25 border border-black justify-center mb-12"
                                                 key={answer.answer_no}>
                                                <p className="bg-gray-200 text-center text-2xl border border-rounded-none">{symbols.find(x => x.id === answer.icon_id).symbol}</p>
                                                <input type="number" min="1" max="9"
                                                       className="w-full text-center text-2xl"
                                                       name={answer.answer_no}/>
                                            </div>

                                        ))
                                    }
                                </div>

                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>

                            </div>
                            <div className="flex items-center justify-center">
                                <div className="flex items-center justify-center">
                                    <button type="submit" ref={submitButtonRef}
                                            className="bg-transparent text-xl hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                                        senden
                                    </button>
                                </div>

                            </div>
                            <div className="borders mr-8 rounded-lg">
                                <div className="flex items-center justify-center">
                                    {minutes === 0 && seconds === 0
                                        ? null
                                        :
                                        <h1 className="text-xl"> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}</h1>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}


Test.getInitialProps = async ({req, res, query}) => {

    let status;
    let data;

    await fetch(`http://localhost:${process.env.APIPORT}/test/${query.testId}`).then(async response => {
        status = response.status;
        await response.json().then(async resData => {
            data = resData

            if (response.status !== 200) {
                if (response.status === 401) {
                    res.writeHead(301, {
                        location: `/test/${query.testId}/sleep`
                    })
                    res.end()
                    //Fragen nicht beantwortet

                } else if (response.status === 404) {
                    //test nicht gefunden

                } else if (response.status === 403) {
                    //test bereits gelöst
                }
                return {
                    props: data,
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

export default Test;