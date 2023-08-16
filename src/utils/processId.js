export const processId = (longId) => {
    const shortId = longId.lastIndexOf("/");
    return ((shortId !== -1 && shortId !== longId.length) ? longId.slice(shortId + 1) : "");
}