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
    let [startButton, setStartButton] = useState(false)
    let [sendButtonEnabled, setSendButtonEnable] = useState(false);


    //todo wenn drugsbutton auf ja gestellt wird, und man danach die schlafqualität ändert, springt der Button zurück auf nein


    let expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 120)

    const {
        seconds,
        minutes,
        start
    } = useTimer({
        expiryTimestamp, autoStart: false, onExpire: () => {
            setSendButtonEnable(true)
            submitButtonRef.current.click()
        }
    });

    const startTest = async () => {
        setStartButton(true)
        start()
    }

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

        //TODO wenn value ausser bereich und abgeschickt wird dann wird nicht gesendet

        let response = await fetch(`https://api.konzentrationstest.ch/test/${router.query.testId}`, {
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

    //Todo design der Anleitungsseite noch fertig machen


    return (
        <>


            <div className="z-40 w-full h-full fixed z-10 top-0 left-0 bg-blue-200 lg:hidden">
                <div className="flex items-center w-full h-full justify-center">
                    <span className="f align-center">
                        Bitte benutze ein Tablet, damit der Test korrekt auf deinem Gerät angezeigt wird.
                    </span>
                </div>
            </div>
            {!startButton ?
                <div className="z-40 w-full h-full fixed z-10 top-0 left-0">
                    <div className="bg-gray-100 flex items-center w-full h-full justify-center">
                            <div className="ml-4 justify-center items-center flex justify-center">
                                <span className="text-xl">
                                    Im oberen Teil der Box hat es immer ein Symbol, im unteren Teil eine Zahl von 1 - 9. Es muss also immer eine Zahl für das jeweilige Symbol eingefügt werden. Zum nächsten Symbol kommst du, indem du die tab Taste benutzt.
                                    <br/>
                                    Sobald du auf start drückst, wird dir dein Test angezeigt. Ab diesem Moment hast du 2 Minuten Zeit, diesen zu lösen. Er wird bei Abschluss dieser Zeit automatisch abgesendet.

                                </span>
                                <Image src={testimage} className="justify-center items-center transform scale-75"/>
                            </div>
                            <div className="flex items-center justify-center">
                                <button type="submit" onClick={event => startTest()}
                                        className="justify-center items-center bg-transparent text-xl hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4
                                        border border-blue-500 hover:border-transparent rounded">
                                    starten
                                </button>
                            </div>
                    </div>
                </div> : null
            }
            {startButton === false ? null :
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
            }
        </>
    )
}


Test.getInitialProps = async ({res, query}) => {

    const dev = process.env.NODE_ENV !== 'production';
    const server = dev ? 'http://localhost:8080' : 'https://konzentrationstest.ch';

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