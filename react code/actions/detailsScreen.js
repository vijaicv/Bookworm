import dispatcher from '../dispatcher/Dispatcher';
export function showdetails(id) {
    dispatcher.dispatch(
        {
            type: "SHOW_DETAILS",
            id: id
        }
    )
}