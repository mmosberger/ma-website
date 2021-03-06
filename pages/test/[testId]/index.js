import {useRouter} from "next/router";
import symbols from "../../../public/symbols.json"
import {useState, useRef} from "react";
import React from "react"
import {useTimer} from "react-timer-hook"
import Image from 'next/image'
import testimage from '../../../public/test_image.png'


const Test = ({data}) => {


    const router = useRouter();
    const submitButtonRef = useRef();
    let [sendButtonEnabled, setSendButtonEnable] = useState(false);


    let expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 120)

    const {
        seconds,
        minutes,
        start
    } = useTimer({
        expiryTimestamp, onExpire: () => {
            setSendButtonEnable(true)
            submitButtonRef.current.click()
        }
    });

    const handleSubmit = async (e) => {

        e.preventDefault()

        let arr = e.target.elements
        let newArr = []


        for (let item of arr) {
            let userInput;
            if (item.type === "number") {

                if (item.value === "") {
                    userInput = null
                } else {
                    userInput = parseInt(item.value)
                }

                let obj = {
                    "user_input": userInput,
                    "answer_no": parseInt(item.name),
                    "icon_id": parseInt(item.id)
                }
                newArr.push(obj)
            }
        }


        const dev = process.env.NODE_ENV !== 'production';
        const server = dev ? 'http://localhost:8080' : 'https://api.konzentrationstest.ch';

        let response = await fetch(server + `/test/${router.query.testId}`, {
            method: "PATCH",
            body: JSON.stringify({
                "answers": newArr,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.status === 200) {
            window.location.href = `/test/${router.query.testId}/ended`
        } else {
            console.log(response.status)
        }
    }


    return (
        <>
            <div className="z-40 w-full h-full fixed z-10 top-0 left-0 bg-blue-200 lg:hidden">
                <div className="flex items-center w-full h-full justify-center">
                    <span className="flex align-center">
                        Bitte benutze ein Tablet, damit der Test korrekt auf deinem Ger??t angezeigt wird.
                    </span>
                </div>
            </div>
            <div>
                <form name="testform" onSubmit={(event => handleSubmit(event))}>
                    <div className="bg-gray-100 min-w-screen min-h-screen">
                        <div className="flex p-10 w-full">
                            <div className="flex flex-wrap w-full items-center justify-center">
                                {
                                    data.legende.map(number => (

                                        <div className="border border-black justify-center w-12"
                                             key={number.icon_no}
                                             id={number.icon_id}>
                                            <p className="bg-gray-200 text-center text-2xl font-bold border border-rounded-none p-2">{symbols.find(x => x.id === number.icon_id).symbol}</p>
                                            <p className="text-center text-2xl font-bold border border-rounded-none p-2">{number.icon_no}</p>
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
                                                <input type="number"
                                                       className="w-full text-center text-2xl"
                                                       name={answer.answer_no} id={answer.tableRow}/>
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
                                    <button type="submit" ref={submitButtonRef} disabled={!sendButtonEnabled}
                                            className="hidden">
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


Test.getInitialProps = async ({res, query}) => {

    const dev = process.env.NODE_ENV !== 'production';
    const server = dev ? 'http://localhost:8080' : 'https://api.konzentrationstest.ch';

    let status;
    let data;

    await fetch(server + `/test/${query.testId}`).then(async response => {
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

                } else if (response.status === 409) {
                    // Fragen beantwortet, test noch nicht gestartet
                    res.writeHead(301, {
                        location: `/test/${query.testId}/init`
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

export default Test;