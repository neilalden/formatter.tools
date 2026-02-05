const isNumber = (input: unknown): input is number => {
    if (typeof input !== "string" && typeof input !== "number") return false
    if (Math.abs(Number(input) - Number(input)) !== 0) return false;
    if (String(input).trim() === "") return false;
    if (/[a-zA-Z]/g.test(String(input))) return false;
    return isFinite(+input)
}

export default isNumber