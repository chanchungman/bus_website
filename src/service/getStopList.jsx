export default async function getStopList(setStopList, type, urlParams) {
    let url;
    let bound;
    let route;
    ////GET URL VALUE////


    url = 'https://data.etabus.gov.hk/v1/transport/kmb/stop/';

    if(url){
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });
        const data = await response.json();
        setStopList(data)
    }
}