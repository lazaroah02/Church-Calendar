export function truncText(text:string, length: number): string{
    if(text.length > length){
        return `${text.substring(0, length)}...`
    }
    return text
}

export function getFirstWord(text: string): string{
    return text.split(" ")[0]
}