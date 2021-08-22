
const solved = () => {
   return (

       <div className="min-h-screen min-w-screen  w-full h-full bg-gray-200 flex justify-center items-center">
           <div className="space-y-6 h-full">
               <h1 className="text-center text-3xl">Dieser Test wurde bereits gelöst oder wird zurzeit noch gelöst.</h1>
           </div>
       </div>
    )
}


solved.getInitialProps = async ({res, query}) => {

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
                    res.writeHead(301, {
                        location: `/testNotFound`
                    })
                    res.end()
                    //test exisitert nicht
                }
            } else {
                res.writeHead(301, {
                    location: `/test/${query.testId}/sleep`
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

export default solved;