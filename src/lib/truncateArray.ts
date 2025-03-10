export function truncateArray<T>(arr: T[]): (T | false)[] {
    if (arr.length > 4) {
        return [...arr.slice(0, 4), false];
    }
    return arr;
}

