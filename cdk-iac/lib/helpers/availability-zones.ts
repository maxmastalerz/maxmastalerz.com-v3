/**
 * Maps numbers to letters with 0->a , 1->b, 2->c and so on up to the letter f (Highest letter availability zone as of Mar 2024 )
 * @param num The number to map to a letter.
 * @returns The corresponding letter for the input number.
 * @throws Error if the input number is out of range (less than 0 or greater than 5).
 */
function numToAZLetter(num: number): string {
    if(num < 0 || num > 5) {
        throw new Error("Number out of range. Only numbers between 0 and 5 are supported.");
    }
 
    return String.fromCharCode(97 + num);
}
 
export { numToAZLetter };