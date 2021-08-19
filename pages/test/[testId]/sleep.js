import {useRouter} from "next/router";
import {useState} from 'react';


const Sleep = ({data}) => {

    const router = useRouter()
    const {testId} = router.query


    const [sleep_start, setStart] = useState("");
    const [sleep_end, setEnd] = useState("");
    const [drugs, setDrugs] = useState("");
    const [quality, setQuality] = useState("");




    console.log(drugs)

    const submitAnswers = async () => {
        const response = await fetch(`http://localhost:${process.env.APIPORT}/test/${testId}/sleep`, {
            method: "PATCH",
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        alert("test")
    }

    let msg = data.errors[0].msg
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center px-20">
            <div className="space-y-6">

                <h1 className="text-center mt-5 text-4xl font-bold">Fragebogen</h1>
                <div className="flex items-center p-6 space-x-6 bg-white rounded-xl shadow-lg">
                    <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold">
                        <span>Wann bist du schlafen gegangen?</span>
                    </div>
                    <div className="flex bg-gray-100 p-4 rounded-lg">
                        <input className="bg-gray-100 rounded-lg outline-none" type="datetime-local"
                               min="2021-08-20T00:00" max="2021-11-30T00:00"
                        onChange={(e) => setStart(e.target.value)}/>
                    </div>
                </div>

                <div className="flex items-center p-6 space-x-6 bg-white rounded-xl shadow-lg">
                    <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold">
                        <span>Wann bist du aufgewacht?</span>
                    </div>
                    <div className="flex justify-self-end bg-gray-100 p-4 space-x-4 rounded-lg">
                        <input className="bg-gray-100 rounded-lg outline-none" type="datetime-local"
                               min="2021-08-20T00:00" max="2021-11-30T00:00"
                               onChange={(e) => setEnd(e.target.value)}/>
                    </div>
                </div>

                <div className="flex items-center p-6 space-x-6 bg-white rounded-xl shadow-lg">
                    <div className="flex py-3 px-4 rounded-lg text-gray-500 font-semibold">
                        <span>Hast du in den letzten 12 Stunden Alkohol oder Nikotion konsumiert?</span>
                    </div>

                    <div className="flex-auto bg-gray-100 p-4 space-x-8 rounded-lg">
                        <label className="inline-flex space-x-2 items-center">
                            <input type="radio" className="form-radio" name="drugsbuttons" value="1"
                                   onClick={(e) => setDrugs("1")}/>
                            <span>Ja</span>
                        </label>
                        <label className="inline-flex space-x-2 items-center">
                            <input type="radio" className="form-radio" name="drugsbuttons" value="0"
                                   onClick={(e) => setDrugs("0")}/>
                            <span>Nein</span>
                        </label>
                    </div>
                </div>


                <div className="flex items-center p-6 space-x-6 bg-white rounded-xl shadow-lg">
                    <div className="py-3 px-4 rounded-lg text-gray-500 font-semibold">
                        <span>Wie gut hast du geschlafen?<br/>(1 = sehr schlecht, 10 = sehr gut) </span>
                    </div>
                    <div className="flex justify-end bg-gray-100 p-4 space-x-8 rounded-lg">
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
                <div className="flex justify-center items-center py-2 px-4">
                    <button type= "submit" className="bg-blue-700 hover:bg-blue-800 px-5 py-3 rounded-lg text-white text-xl duration-500" onSubmit={submitAnswers()}>
                        absenden
                    </button>
                </div>
            </div>
        </div>
    )
}


Sleep.getInitialProps = async ({req, res, query}) => {

    let status;
    let data;

    await fetch(`http://localhost:${process.env.APIPORT}/test/${query.testId}`).then(async response => {
        status = response.status;
        await response.json().then(async resData => {
            data = resData

            if (response.status !== 200) {
                if (response.status === 401) {
                    //Fragen nicht beantwortet


                } else if (response.status === 404) {
                    res.writeHead(301, {
                        location: `/404`
                    })
                    //test nicht gefunden

                } else if (response.status === 403) {
                    //test bereits gelöst
                }
                return {
                    props: data,
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