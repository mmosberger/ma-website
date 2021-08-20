import {useRouter} from "next/router";

const Test = ({data}) => {

    let legende = data.legende;

    return (
        <div className="bg-gray-100 min-w-screen min-h-screen">
            <div className="flex items-center justify-center">
                <div className="mt-5">
                    <table className="table-fixed border-collapse border border-black">
                        <thead>
                        <tr>
                            <th className="w-1/2">Title</th>
                            <th className="w-1/4">Author</th>
                            <th className="w-1/4">Views</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="border border-black">Intro to CSS</td>
                            <td className="border border-black">Adam</td>
                            <td className="border border-black">858</td>
                        </tr>
                        <tr className="bg-blue-200">
                            <td className="border border-black">A Long and Winding Tour of the History of UI Frameworks
                                and Tools and the Impact on
                                Design
                            </td>
                            <td className="border border-black">Adam</td>
                            <td className="border border-black">112</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="m-5 flex justify-center">
                <div className="flex mt-10 flex-wrap max-w-7xl">
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                    <div className="w-1/12">
                        <div>
                            <p>Icon</p>
                            <input placeholder="test"/>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}


Test.getInitialProps = async ({req, res, query}) => {

    let status;
    let data;

    await fetch(`http://localhost:${process.env.APIPORT}/test/${query.testId}`).then(async response => {
        status = response.status;
        await response.json().then(async resData => {
            data = resData

            /*if (response.status !== 200) {
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
            }*/
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