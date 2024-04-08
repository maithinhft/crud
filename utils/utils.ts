export function checkNumber(str: string): boolean {
    if (isNaN(parseInt(str))) return false;
    return true;
}
