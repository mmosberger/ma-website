import {useRouter} from "next/router";

const Test = ({data}) => {
    return (
        <div>
            Hallo
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

            if (response.status !== 200) {
                if (response.status === 401){
                    res.writeHead(301, {
                        location: `/test/${query.testId}/sleep`
                    })
                    res.end()
                    //Fragen nicht beantwortet

                } else if (response.status === 404){
                    //test nicht gefunden

                } else if (response.status === 403){
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