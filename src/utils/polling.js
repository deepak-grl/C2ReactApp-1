import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import polling from 'rx-polling';


export function startPollingFn(url, interval, callback) {
    const request$ = ajax({
        url: url,
        crossDomain: true
    }).pipe(
        map(response => response.response || []),
        map(response => response.slice(0, 10))
    );

    let subscription = polling(request$, { interval: interval, backoffStrategy: "exponential", attempts: 4 })
        .subscribe((res) => {
            callback(res);
        }, (error) => {
            return null;
        });

    return subscription;
}

export function stopPollingFn() {
    const request$ = ajax({
        url: 'https://jsonplaceholder.typicode.com/comments/',
        crossDomain: true
    }).pipe(
        map(response => response.response || []),
        map(response => response.slice(0, 10))
    );

    let subscription = polling(request$, { interval: 5000 })
        .subscribe((comments) => {
          // console.log(comments);
        });

    window.setTimeout(() => {
        // Close the polling
        subscription.unsubscribe();
    }, 5000);

}
