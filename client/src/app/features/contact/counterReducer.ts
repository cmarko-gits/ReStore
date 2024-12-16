
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER'
export const DECREMENT_COUNTER = "DECREMENT_COUNTER"

export function increment(amount = 1) {
    return {
        type: 'INCREMENT_COUNTER',  // Uverite se da su ovi tipovi u stringovima
        payload: amount 
    };
}

export function decrement(amount = 1) {
    return {
        type: 'DECREMENT_COUNTER',  // Isto kao i za INCREMENT_COUNTER
        payload: amount
    };
}

