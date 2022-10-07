export default async function getBusList(setBusList, type, urlParams, values = null) {
    let url;
    let bound;
    let route;
    let search_query;
    ////GET URL VALUE////
    if (urlParams) {
        route = urlParams.get('route')
        urlParams.get('bound') == 'O' ?
            bound = 'outbound' : bound = 'inbound';
        search_query = urlParams.get('search_query')
    }
    switch (type) {
        case 'get_all':
            url = 'https://data.etabus.gov.hk/v1/transport/kmb/route';
            break;
        case 'bus':
            url = 'https://data.etabus.gov.hk/v1/transport/kmb/route-stop/' + route + '/' + bound + '/1';
            break;
        case 'bus_by_stop':
            url = 'https://data.etabus.gov.hk/v1/transport/kmb/stop-eta/'+values;
            break;
        default:
            console.log('404')
    }

    if (url) {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
            },
        });
        const data = await response.json();

        ///check user have search bus////
        if (search_query) {
            const filter = Object.values(data.data).filter(e =>
                e['route'] == search_query
            )
            const result = { generated_timestamp: data.generated_timestamp, data: filter }
            setBusList(result)
        }
        ///check value ////
        else if (values!=null) {
            Object.assign(data, {values: values});
            setBusList(data)
        }
        ////show all/////
        else {
            setBusList(data)
        }

    }
}