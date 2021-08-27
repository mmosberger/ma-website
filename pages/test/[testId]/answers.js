import symbols from "../../../public/symbols.json"
import React from "react"

const Answers = ({data}) => {

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
                <form name="testform">
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
                                                <p className="bg-white text-center text-2xl border border-rounded-none">{answer.user_input ? answer.user_input : "-"}</p>
                                            </div>
                                        ))
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


Answers.getInitialProps = async ({res, query}) => {

    let status;
    let data;

    await fetch(`https://api.konzentrationstest.ch/test/${query.testId}`).then(async response => {
        status = response.status;
        await response.json().then(async resData => {
            data = resData

            if (response.status !== 402){
                res.writeHead(301, {
                    location: `/test/${query.testId}`
                })
                res.end()

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

export default Answers;